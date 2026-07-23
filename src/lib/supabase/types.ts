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
          status: string
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          message?: string | null
          name: string
          property_location?: string | null
          status?: string
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          message?: string | null
          name?: string
          property_location?: string | null
          status?: string
        }
        Relationships: []
      }
      cost_benchmarks: {
        Row: {
          category: string | null
          created_at: string
          id: string
          label: string
          typical_amount: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          label: string
          typical_amount: number
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          label?: string
          typical_amount?: number
        }
        Relationships: []
      }
      maintenance_schedules: {
        Row: {
          active: boolean
          created_at: string
          id: string
          interval_months: number
          next_due_date: string
          property_id: string
          title: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          interval_months: number
          next_due_date: string
          property_id: string
          title: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          interval_months?: number
          next_due_date?: string
          property_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
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
          recurring_period: string | null
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
          recurring_period?: string | null
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
          recurring_period?: string | null
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
          monthly_fee: number
          notes: string | null
          property_type: string
        }
        Insert: {
          address: string
          client_id: string
          created_at?: string
          id?: string
          monthly_fee?: number
          notes?: string | null
          property_type?: string
        }
        Update: {
          address?: string
          client_id?: string
          created_at?: string
          id?: string
          monthly_fee?: number
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
      rate_limit_events: {
        Row: {
          action: string
          created_at: string
          id: string
          identifier: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          identifier: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      work_order_comments: {
        Row: {
          author_name: string
          author_role: string
          body: string
          created_at: string
          id: string
          work_order_id: string
        }
        Insert: {
          author_name: string
          author_role: string
          body: string
          created_at?: string
          id?: string
          work_order_id: string
        }
        Update: {
          author_name?: string
          author_role?: string
          body?: string
          created_at?: string
          id?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_comments_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
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
          artisan_rating: number | null
          artisan_rating_note: string | null
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
          artisan_rating?: number | null
          artisan_rating_note?: string | null
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
          artisan_rating?: number | null
          artisan_rating_note?: string | null
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
      add_work_order_comment: {
        Args: { p_body: string; p_work_order_id: string }
        Returns: {
          author_name: string
          author_role: string
          body: string
          created_at: string
          id: string
          work_order_id: string
        }
      }
      artisan_assigned_to_property: {
        Args: { p_property_id: string }
        Returns: boolean
      }
      artisan_assigned_to_work_order: {
        Args: { p_work_order_id: string }
        Returns: boolean
      }
      artisan_update_work_order: {
        Args: {
          p_status: string
          p_turnover_checklist?: Json
          p_work_order_id: string
        }
        Returns: {
          artisan_rating: number | null
          artisan_rating_note: string | null
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
      can_access_work_order: {
        Args: { p_work_order_id: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_events: number
          p_window_minutes: number
        }
        Returns: boolean
      }
      client_owns_property: {
        Args: { p_property_id: string }
        Returns: boolean
      }
      client_rate_work_order: {
        Args: { p_note: string; p_rating: number; p_work_order_id: string }
        Returns: {
          artisan_rating: number | null
          artisan_rating_note: string | null
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
      current_artisan_id: { Args: never; Returns: string }
      current_client_id: { Args: never; Returns: string }
      get_cohost_applications_by_host_token: {
        Args: { p_token: string }
        Returns: {
          applicant_contact: string
          applicant_name: string
          cohost_request_id: string
          created_at: string
          id: string
          message: string | null
          status: string
        }[]
      }
      get_cohost_request_by_host_token: {
        Args: { p_token: string }
        Returns: {
          created_at: string
          host_contact: string
          host_name: string
          host_token: string
          id: string
          property_description: string
          status: string
        }[]
      }
      get_cohost_request_public: {
        Args: { p_request_id: string }
        Returns: {
          id: string
          property_description: string
          status: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      select_cohost_applicant: {
        Args: {
          p_application_id: string
          p_host_token: string
          p_terms_note: string
        }
        Returns: {
          id: string
        }[]
      }
      submit_cohost_application: {
        Args: {
          p_applicant_contact: string
          p_applicant_name: string
          p_message: string
          p_request_id: string
        }
        Returns: {
          id: string
        }[]
      }
      submit_cohost_request: {
        Args: {
          p_host_contact: string
          p_host_name: string
          p_property_description: string
        }
        Returns: {
          host_token: string
          id: string
        }[]
      }
      update_own_artisan_profile: {
        Args: { p_name: string; p_phone: string }
        Returns: {
          added_by_admin: string | null
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
      }
      update_own_client_profile: {
        Args: { p_name: string; p_phone: string }
        Returns: {
          auth_user_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
