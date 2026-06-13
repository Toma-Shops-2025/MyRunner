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
      driver_applications: {
        Row: {
          background_check_status: string | null
          created_at: string
          id: string
          insurance_provider: string | null
          license_number: string | null
          license_state: string | null
          notes: string | null
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
          user_id: string
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          vehicle_year: number | null
        }
        Insert: {
          background_check_status?: string | null
          created_at?: string
          id?: string
          insurance_provider?: string | null
          license_number?: string | null
          license_state?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          user_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
        }
        Update: {
          background_check_status?: string | null
          created_at?: string
          id?: string
          insurance_provider?: string | null
          license_number?: string | null
          license_state?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          user_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: number | null
        }
        Relationships: []
      }
      driver_payouts: {
        Row: {
          amount_cents: number
          created_at: string
          driver_id: string
          error_message: string | null
          fee_share_cents: number
          id: string
          order_id: string
          status: string
          stripe_transfer_id: string | null
          tip_cents: number
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          driver_id: string
          error_message?: string | null
          fee_share_cents?: number
          id?: string
          order_id: string
          status?: string
          stripe_transfer_id?: string | null
          tip_cents?: number
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          driver_id?: string
          error_message?: string | null
          fee_share_cents?: number
          id?: string
          order_id?: string
          status?: string
          stripe_transfer_id?: string | null
          tip_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_payouts_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_preferences: {
        Row: {
          created_at: string
          customer_id: string
          driver_id: string
          id: string
          preference: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          driver_id: string
          id?: string
          preference: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          driver_id?: string
          id?: string
          preference?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          attempt_number: number
          created_at: string
          driver_id: string
          expires_at: string
          id: string
          offered_at: string
          order_id: string
          status: string
          updated_at: string
        }
        Insert: {
          attempt_number?: number
          created_at?: string
          driver_id: string
          expires_at: string
          id?: string
          offered_at?: string
          order_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_number?: number
          created_at?: string
          driver_id?: string
          expires_at?: string
          id?: string
          offered_at?: string
          order_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          order_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          order_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          order_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          additional_pickups: number
          created_at: string
          customer_id: string
          dispatch_attempts: number
          dispatch_status: string
          distance_miles: number | null
          driver_id: string | null
          driver_payout_cents: number
          dropoff_address: string
          id: string
          item_description: string
          last_dispatched_at: string | null
          notes: string | null
          paid_at: string | null
          paid_out_at: string | null
          payment_status: string
          payout_status: string
          pickup_address: string
          pickup_lat: number | null
          pickup_lng: number | null
          platform_fee_cents: number
          price_cents: number
          scheduled_for: string | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_session_id: string | null
          stripe_transfer_id: string | null
          tip_cents: number
          type: Database["public"]["Enums"]["order_type"]
          updated_at: string
        }
        Insert: {
          additional_pickups?: number
          created_at?: string
          customer_id: string
          dispatch_attempts?: number
          dispatch_status?: string
          distance_miles?: number | null
          driver_id?: string | null
          driver_payout_cents?: number
          dropoff_address: string
          id?: string
          item_description: string
          last_dispatched_at?: string | null
          notes?: string | null
          paid_at?: string | null
          paid_out_at?: string | null
          payment_status?: string
          payout_status?: string
          pickup_address: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          platform_fee_cents?: number
          price_cents?: number
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          stripe_transfer_id?: string | null
          tip_cents?: number
          type?: Database["public"]["Enums"]["order_type"]
          updated_at?: string
        }
        Update: {
          additional_pickups?: number
          created_at?: string
          customer_id?: string
          dispatch_attempts?: number
          dispatch_status?: string
          distance_miles?: number | null
          driver_id?: string | null
          driver_payout_cents?: number
          dropoff_address?: string
          id?: string
          item_description?: string
          last_dispatched_at?: string | null
          notes?: string | null
          paid_at?: string | null
          paid_out_at?: string | null
          payment_status?: string
          payout_status?: string
          pickup_address?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          platform_fee_cents?: number
          price_cents?: number
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          stripe_transfer_id?: string | null
          tip_cents?: number
          type?: Database["public"]["Enums"]["order_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          background_check_status: string
          background_check_updated_at: string | null
          checkr_candidate_id: string | null
          checkr_report_id: string | null
          checkr_report_status: string | null
          created_at: string
          current_lat: number | null
          current_lng: number | null
          date_of_birth: string | null
          driver_status: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          home_address: string | null
          home_city: string | null
          home_state: string | null
          home_zip: string | null
          id: string
          is_active: boolean
          location_updated_at: string | null
          onboarding_completed_at: string | null
          payouts_enabled: boolean
          phone: string | null
          ssn_last4: string | null
          stripe_connect_account_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          background_check_status?: string
          background_check_updated_at?: string | null
          checkr_candidate_id?: string | null
          checkr_report_id?: string | null
          checkr_report_status?: string | null
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          date_of_birth?: string | null
          driver_status?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          home_address?: string | null
          home_city?: string | null
          home_state?: string | null
          home_zip?: string | null
          id: string
          is_active?: boolean
          location_updated_at?: string | null
          onboarding_completed_at?: string | null
          payouts_enabled?: boolean
          phone?: string | null
          ssn_last4?: string | null
          stripe_connect_account_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          background_check_status?: string
          background_check_updated_at?: string | null
          checkr_candidate_id?: string | null
          checkr_report_id?: string | null
          checkr_report_status?: string | null
          created_at?: string
          current_lat?: number | null
          current_lng?: number | null
          date_of_birth?: string | null
          driver_status?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          home_address?: string | null
          home_city?: string | null
          home_state?: string | null
          home_zip?: string | null
          id?: string
          is_active?: boolean
          location_updated_at?: string | null
          onboarding_completed_at?: string | null
          payouts_enabled?: boolean
          phone?: string | null
          ssn_last4?: string | null
          stripe_connect_account_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          order_id: string
          ratee_id: string
          rater_id: string
          stars: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id: string
          ratee_id: string
          rater_id: string
          stars: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          order_id?: string
          ratee_id?: string
          rater_id?: string
          stars?: number
        }
        Relationships: []
      }
      reports: {
        Row: {
          category: string
          created_at: string
          details: string
          id: string
          order_id: string | null
          reported_user_id: string | null
          reporter_id: string
          status: string
        }
        Insert: {
          category: string
          created_at?: string
          details: string
          id?: string
          order_id?: string | null
          reported_user_id?: string | null
          reporter_id: string
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          details?: string
          id?: string
          order_id?: string | null
          reported_user_id?: string | null
          reporter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_rating_stats: {
        Row: {
          avg_stars: number | null
          review_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      haversine_miles: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
    }
    Enums: {
      app_role: "customer" | "driver" | "admin"
      driver_status: "pending" | "approved" | "rejected" | "suspended"
      order_status:
        | "pending"
        | "accepted"
        | "picked_up"
        | "in_transit"
        | "delivered"
        | "cancelled"
      order_type: "standard" | "multi_pickup" | "multi_dropoff" | "scheduled"
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
    Enums: {
      app_role: ["customer", "driver", "admin"],
      driver_status: ["pending", "approved", "rejected", "suspended"],
      order_status: [
        "pending",
        "accepted",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
      ],
      order_type: ["standard", "multi_pickup", "multi_dropoff", "scheduled"],
    },
  },
} as const
