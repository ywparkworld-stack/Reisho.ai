export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; username: string; created_at: string }
        Insert: { id: string; username: string; created_at?: string }
        Update: { id?: string; username?: string; created_at?: string }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          line1: string
          line2: string
          line3: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          line1: string
          line2: string
          line3: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          line1?: string
          line2?: string
          line3?: string
          created_at?: string
        }
      }
      likes: {
        Row: { id: string; user_id: string; post_id: string; created_at: string }
        Insert: { id?: string; user_id: string; post_id: string; created_at?: string }
        Update: { id?: string; user_id?: string; post_id?: string; created_at?: string }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Like = Database['public']['Tables']['likes']['Row']

export type PostWithDetails = Post & {
  profiles: Profile
  likes: Like[]
  liked_by_user: boolean
  like_count: number
}
