export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sales_data: {
        Row: {
          id: string
          date: string
          total_sales: number
          food_sales: number | null
          bar_sales: number | null
          wine_sales: number | null
          happy_hour_sales: number | null
          sales_7pm_to_10pm: number | null
          after_10pm_sales: number | null
          total_pax: number
          reservations: number | null
          walk_ins: number | null
          no_shows: number | null
          cancellations: number | null
          phone_calls_answered: number | null
          missed_phone_calls: number | null
          per_head_spend: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          total_sales: number
          food_sales?: number | null
          bar_sales?: number | null
          wine_sales?: number | null
          happy_hour_sales?: number | null
          sales_7pm_to_10pm?: number | null
          after_10pm_sales?: number | null
          total_pax: number
          reservations?: number | null
          walk_ins?: number | null
          no_shows?: number | null
          cancellations?: number | null
          phone_calls_answered?: number | null
          missed_phone_calls?: number | null
          per_head_spend: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          total_sales?: number
          food_sales?: number | null
          bar_sales?: number | null
          wine_sales?: number | null
          happy_hour_sales?: number | null
          sales_7pm_to_10pm?: number | null
          after_10pm_sales?: number | null
          total_pax?: number
          reservations?: number | null
          walk_ins?: number | null
          no_shows?: number | null
          cancellations?: number | null
          phone_calls_answered?: number | null
          missed_phone_calls?: number | null
          per_head_spend?: number
          created_at?: string
          updated_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          sales_data_id: string
          method: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          sales_data_id: string
          method: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          sales_data_id?: string
          method?: string
          amount?: number
          created_at?: string
        }
      }
      promotions: {
        Row: {
          id: string
          sales_data_id: string
          name: string
          amount: number
          sets: number
          created_at: string
        }
        Insert: {
          id?: string
          sales_data_id: string
          name: string
          amount: number
          sets: number
          created_at?: string
        }
        Update: {
          id?: string
          sales_data_id?: string
          name?: string
          amount?: number
          sets?: number
          created_at?: string
        }
      }
    }
  }
}