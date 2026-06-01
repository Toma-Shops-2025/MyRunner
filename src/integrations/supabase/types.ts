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
          created_at: string
          customer_id: string
          distance_miles: number | null
          driver_id: string | null
          dropoff_address: string
          id: string
          item_description: string
          notes: string | null
          pickup_address: string
          price_cents: number
          scheduled_for: string | null
          status: Database["public"]["Enums"]["order_status"]
          tip_cents: number
          type: Database["public"]["Enums"]["order_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          distance_miles?: number | null
          driver_id?: string | null
          dropoff_address: string
          id?: string
          item_description: string
          notes?: string | null
          pickup_address: string
          price_cents?: number
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tip_cents?: number
          type?: Database["public"]["Enums"]["order_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          distance_miles?: number | null
          driver_id?: string | null
          dropoff_address?: string
          id?: string
          item_description?: string
          notes?: string | null
          pickup_address?: string
          price_cents?: number
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          tip_cents?: number
          type?: Database["public"]["Enums"]["order_type"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
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
