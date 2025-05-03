import { v2 as cloudinary } from "npm:cloudinary@1.41.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Cloudinary credentials (you can move these to env variables later)
cloudinary.config({
  cloud_name: "dasieigwp",
  api_key: "143716986624414",
  api_secret: "3zUB2317KOtDn4MD_mvh2Y9YYsY",
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64Data}`,
      {
        folder: "restaurant_images",
        upload_preset: "restaurant_images", // required if preset is used
        transformation: [
          { width: 1200, height: 800, crop: "fill" },
          { quality: "auto", fetch_format: "auto" },
        ],
      }
    );

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
