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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          target_resource: string | null
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          target_resource?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          target_resource?: string | null
        }
        Relationships: []
      }
      branding_configs: {
        Row: {
          accent_color: string
          company_id: string
          created_at: string
          cta_color: string
          dark_mode: boolean
          font_family: string | null
          id: string
          logo_url: string | null
          primary_color: string
          updated_at: string
        }
        Insert: {
          accent_color?: string
          company_id: string
          created_at?: string
          cta_color?: string
          dark_mode?: boolean
          font_family?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string
          company_id?: string
          created_at?: string
          cta_color?: string
          dark_mode?: boolean
          font_family?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branding_configs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_products: {
        Row: {
          badge: string | null
          base_price: number
          conversion_rate: number | null
          created_at: string
          cta_label: string
          description: string | null
          display_order: number
          features: string[] | null
          id: string
          is_active: boolean
          min_order_quantity: number
          name: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          base_price: number
          conversion_rate?: number | null
          created_at?: string
          cta_label?: string
          description?: string | null
          display_order?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          min_order_quantity?: number
          name: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          base_price?: number
          conversion_rate?: number | null
          created_at?: string
          cta_label?: string
          description?: string | null
          display_order?: number
          features?: string[] | null
          id?: string
          is_active?: boolean
          min_order_quantity?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          lead_name: string
          lead_product_id: string | null
          order_id: string
          price_per_lead: number
          quantity: number
          total_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          lead_name: string
          lead_product_id?: string | null
          order_id: string
          price_per_lead: number
          quantity: number
          total_price: number
        }
        Update: {
          created_at?: string
          id?: string
          lead_name?: string
          lead_product_id?: string | null
          order_id?: string
          price_per_lead?: number
          quantity?: number
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_lead_product_id_fkey"
            columns: ["lead_product_id"]
            isOneToOne: false
            referencedRelation: "lead_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          company_id: string | null
          company_slug: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          domain_source: string | null
          id: string
          page_path: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          company_slug: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          domain_source?: string | null
          id?: string
          page_path?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          company_slug?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          domain_source?: string | null
          id?: string
          page_path?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      page_leads: {
        Row: {
          company_id: string
          created_at: string
          custom_price: number | null
          display_order: number
          id: string
          is_visible: boolean
          lead_product_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          custom_price?: number | null
          display_order?: number
          id?: string
          is_visible?: boolean
          lead_product_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          custom_price?: number | null
          display_order?: number
          id?: string
          is_visible?: boolean
          lead_product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_leads_lead_product_id_fkey"
            columns: ["lead_product_id"]
            isOneToOne: false
            referencedRelation: "lead_products"
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
          role?: Database["public"]["Enums"]["app_role"]
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
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
