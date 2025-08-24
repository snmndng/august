
-- Chat system tables for LuxiorMall

-- Chat rooms table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  file_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent availability table
CREATE TABLE IF NOT EXISTS public.agent_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT FALSE,
  status_message TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_customer_id ON public.chat_rooms(customer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_agent_id ON public.chat_rooms(agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_status ON public.chat_rooms(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

-- Enable Row Level Security
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view their own chat rooms" ON public.chat_rooms
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

CREATE POLICY "Customers can create chat rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Agents and admins can update chat rooms" ON public.chat_rooms
  FOR UPDATE USING (
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_rooms 
      WHERE id = room_id AND (
        customer_id = auth.uid() OR 
        agent_id = auth.uid()
      )
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

CREATE POLICY "Users can send messages in their rooms" ON public.chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.chat_rooms 
      WHERE id = room_id AND (
        customer_id = auth.uid() OR 
        agent_id = auth.uid()
      )
    )
  );

-- RLS Policies for agent_availability
CREATE POLICY "Everyone can view agent availability" ON public.agent_availability
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Agents can update their own availability" ON public.agent_availability
  FOR ALL USING (
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('admin')
    )
  );

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_chat_rooms_updated_at 
  BEFORE UPDATE ON public.chat_rooms 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_availability_updated_at 
  BEFORE UPDATE ON public.agent_availability 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
