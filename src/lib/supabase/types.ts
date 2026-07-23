// Generated via the Supabase MCP `generate_typescript_types` against the
// live project schema. Regenerate after any migration that changes the
// public schema shape.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      artisans: {
        Row: {
          added_by_admin: string | null
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          added_by_admin?: string | null
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          added_by_admin?: string | null
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artisans_added_by_admin_fkey"
            columns: ["added_by_admin"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      cohost_agreements: {
        Row: {
          cohost_request_id: string
          date_matched: string
          id: string
          selected_applicant_id: string
          terms_note: string | null
        }
        Insert: {
          cohost_request_id: string
          date_matched?: string
          id?: string
          selected_applicant_id: string
          terms_note?: string | null
        }
        Update: {
          cohost_request_id?: string
          date_matched?: string
          id?: string
          selected_applicant_id?: string
          terms_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cohost_agreements_cohost_request_id_fkey"
            columns: ["cohost_request_id"]
            isOneToOne: false
            referencedRelation: "cohost_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cohost_agreements_selected_applicant_id_fkey"
            columns: ["selected_applicant_id"]
            isOneToOne: false
            referencedRelation: "cohost_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      cohost_applications: {
        Row: {
          applicant_contact: string
          applicant_name: string
          cohost_request_id: string
          created_at: string
          id: string
          message: string | null
          status: string
        }
        Insert: {
          applicant_contact: string
          applicant_name: string
          cohost_request_id: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
        }
        Update: {
          applicant_contact?: string
          applicant_name?: string
          cohost_request_id?: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "cohost_applications_cohost_request_id_fkey"
            columns: ["cohost_request_id"]
            isOneToOne: false
            referencedRelation: "cohost_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      cohost_requests: {
        Row: {
          created_at: string
          host_contact: string
          host_name: string
          host_token: string
          id: string
          property_description: string
          status: string
        }
        Insert: {
          created_at?: string
          host_contact: string
          host_name: string
          host_token?: string
          id?: string
          property_description: string
          status?: string
        }
        Update: {
          created_at?: string
          host_contact?: string
          host_name?: string
          host_token?: string
          id?: string
          property_description?: string
          status?: string
        }
        Relationships: []
      }
      contact_leads: {
        Row: {
          contact: string
          created_at: string
          id: string
          message: string | null
          name: string
          property_location: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          message?: string | null
          name: string
          property_location?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          property_location?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          date: string
          description: string | null
          id: string
          paystack_reference: string | null
          property_id: string | null
          status: string
        }
        Insert: {
          amount: number
          client_id: string
          date?: string
          description?: string | null
          id?: string
          paystack_reference?: string | null
          property_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          client_id?: string
          date?: string
          description?: string | null
          id?: string
          paystack_reference?: string | null
          property_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          client_id: string
          created_at: string
          id: string
          notes: string | null
          property_type: string
        }
        Insert: {
          address: string
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          property_type?: string
        }
        Update: {
          address?: string
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          property_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_photos: {
        Row: {
          caption: string | null
          id: string
          photo_url: string
          timestamp: string
          uploaded_by: string
          work_order_id: string
        }
        Insert: {
          caption?: string | null
          id?: string
          photo_url: string
          timestamp?: string
          uploaded_by: string
          work_order_id: string
        }
        Update: {
          caption?: string | null
          id?: string
          photo_url?: string
          timestamp?: string
          uploaded_by?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_photos_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          assigned_artisan_id: string | null
          cost_amount: number
          cost_breakdown: Json
          created_at: string
          created_by: string
          date: string
          description: string
          flag_reason: string | null
          flagged_for_review: boolean
          id: string
          property_id: string
          status: string
          turnover_checklist: Json | null
          updated_at: string
        }
        Insert: {
          assigned_artisan_id?: string | null
          cost_amount?: number
          cost_breakdown?: Json
          created_at?: string
          created_by: string
          date?: string
          description: string
          flag_reason?: string | null
          flagged_for_review?: boolean
          id?: string
          property_id: string
          status?: string
          turnover_checklist?: Json | null
          updated_at?: string
        }
        Update: {
          assigned_artisan_id?: string | null
          cost_amount?: number
          cost_breakdown?: Json
          created_at?: string
          created_by?: string
          date?: string
          description?: string
          flag_reason?: string | null
          flagged_for_review?: boolean
          id?: string
          property_id?: string
          status?: string
          turnover_checklist?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_assigned_artisan_id_fkey"
            columns: ["assigned_artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      artisan_update_work_order: {
        Args: {
          p_status: string
          p_turnover_checklist?: Json
          p_work_order_id: string
        }
        Returns: {
          assigned_artisan_id: string | null
          cost_amount: number
          cost_breakdown: Json
          created_at: string
          created_by: string
          date: string
          description: string
          flag_reason: string | null
          flagged_for_review: boolean
          id: string
          property_id: string
          status: string
          turnover_checklist: Json | null
          updated_at: string
        }
      }
      current_artisan_id: { Args: Record<string, never>; Returns: string }
      current_client_id: { Args: Record<string, never>; Returns: string }
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database["public"]

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
  Row: infer R
}
  ? R
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"],
> = DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
  Update: infer U
}
  ? U
  : never
