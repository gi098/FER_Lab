import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { products } from "@/lib/data";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// Initialize Gemini client
// Note: This requires GEMINI_API_KEY to be set in your .env.local file
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { userId, message } = await req.json();

        if (!userId || !message) {
            return NextResponse.json({ error: "Missing userId or message" }, { status: 400 });
        }

        // Build product catalog string for the prompt
        const productsCatalog = products.map(p =>
            `- ${p.name}:\n  + Giá: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}\n  + Mô tả: ${p.description}\n  + Ảnh: ![${p.name}](${p.image})`
        ).join('\n\n');

        // 1. Generate Response with Gemini API
        const systemPrompt = `Bạn là tư vấn viên hỗ trợ khách hàng chuyên nghiệp, lịch sự của cửa hàng trang sức cao cấp Luxury Scent. 
Nhiệm vụ của bạn là tư vấn, giải đáp thắc mắc, báo giá và giới thiệu sản phẩm trang sức một cách sang trọng, tinh tế. Câu trả lời cần ngắn gọn, đi vào trọng tâm, bằng tiếng Việt.

ĐẶC BIỆT QUAN TRỌNG: Khi giới thiệu MỘT SẢN PHẨM BẤT KỲ TRONG CỬA HÀNG, BẠN PHẢI sử dụng chính xác thông tin (Đặc biệt là Giá) và hình ảnh minh họa bằng cú pháp Markdown: ![Tên Sản Phẩm](URL). Không bao giờ được tự bịa ra sản phẩm hoặc hình ảnh lỗi.

DƯỚI ĐÂY LÀ TOÀN BỘ DANH SÁCH MẶT HÀNG ĐANG BÁN CỦA CỬA HÀNG BẠN (với đầy đủ tên, giá, mô tả và cú pháp chèn ảnh chuẩn):

${productsCatalog}

Nếu khách hỏi tên bất kỳ sản phẩm nào có trong danh sách trên, bạn hãy báo giá trị thật của nó và kèm theo hình ảnh. Nếu khách hỏi sản phẩm không có trong danh sách, hãy khéo léo giới thiệu các sản phẩm khác tương tự có sẵn.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.7,
            }
        });

        const aiReply = response.text || "Xin lỗi, hiện tại tôi không thể trả lời. Vui lòng thử lại sau.";

        // 2. Insert AI's reply into Supabase messages table
        const { error } = await supabase
            .from("messages")
            .insert({
                user_id: userId,
                content: aiReply,
                sender_type: "ai",
            });

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        return NextResponse.json({ success: true, reply: aiReply });
    } catch (error) {
        console.error("AI Chat API Error:", error);
        return NextResponse.json({ error: "Lỗi khi xử lý tin nhắn" }, { status: 500 });
    }
}
