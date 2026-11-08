import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return new NextResponse("Thiếu SANITY_REVALIDATE_SECRET", {
        status: 500,
      });
    }

    // true = đợi Sanity CDN cập nhật xong rồi mới làm mới cache
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      secret,
      true,
    );

    if (!isValidSignature) {
      return new NextResponse("Chữ ký không hợp lệ", { status: 401 });
    }

    revalidateTag("sanity", { expire: 0 }); // hết hạn ngay lập tức
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
  } catch (err) {
    console.error(err);
    return new NextResponse("Lỗi server", { status: 500 });
  }
}
