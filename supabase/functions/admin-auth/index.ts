const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, error: "Admin login is not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing credentials" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() && password === ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ success: true, token: btoa(`${email}:${Date.now()}`) }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Invalid credentials" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
