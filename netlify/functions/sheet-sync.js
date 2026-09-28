exports.handler = async (event) => {
  // Only accept POST requests from Netlify Form Notifications
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const rawBody = event.body;
    const gasUrl = "https://script.google.com/macros/s/AKfycbz_zdN6hkcB7waqkn5DZJIOD9jrAmutCZlfFbdG2hL8hHgRHnqCPMA7RwRz63Y3j1NU/exec?token=MySuperSecretNetlifyKey_928374";

    // fetch automatically follows Google's 302 redirect
    await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawBody,
      redirect: "follow",
    });

    // Return immediate 200 OK directly to Netlify's internal dispatcher
    return {
      statusCode: 200,
      body: "OK"
    };
  } catch (err) {
    console.error("Failed to forward submission to Google Apps Script:", err);
    return {
      statusCode: 500,
      body: "Internal Error"
    };
  }
};