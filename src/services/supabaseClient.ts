import { createClient } from '@supabase/supabase-js'

// Replace these with your actual details from the Supabase dashboard
const supabaseUrl = 'https://cfvxafzpducusxdzfwbu.supabase.co'
const supabaseKey = 'sb_publishable_Zl8vWrF_FFD5kALvYmpiYA_RjJbgZoI'

export const supabase = createClient(supabaseUrl, supabaseKey)