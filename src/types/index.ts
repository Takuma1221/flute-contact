// 予約フォームデータの型定義
export interface ReservationFormData {
  name: string;
  nameKana: string;
  email: string;
  phone: string;
  liveDate: string;
  seatType: string;
  ticketCount: string;
  paymentMethod: string;
  requests?: string;
  howDidYouKnow: string;
  agreeCancel: boolean;
  agreePrivacy: boolean;
}

// 席種と価格の型定義
export interface SeatType {
  name: string;
  price: number;
}

// API レスポンスの型定義
export interface ReservationResponse {
  success: boolean;
  message: string;
  sheetsSaved?: boolean;
  emailSent?: boolean;
  error?: string;
}

// 演奏会情報の型定義
export interface LiveInfo {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description?: string;
}

// 支払い方法の型定義
export type PaymentMethod = "bank" | "paypay" | "cash";

// 席種の型定義
export type SeatCategory = "front" | "middle" | "back";
