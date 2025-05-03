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
    const { publicId } = await req.json();

    if (!publicId) {
      throw new Error("No public_id provided");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
