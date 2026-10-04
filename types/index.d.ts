// Minimal Database type to satisfy server components (extend as needed)
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: { Row: any };
      test_attempts: { Row: any };
      // add other tables as needed
    };
  };
}
