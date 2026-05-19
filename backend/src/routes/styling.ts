// backend/src/routes/styling.ts  — only the handler changes

stylingRouter.post("/suggestions", async (request, response) => {
  const parsed = stylingRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      message: "Tell Osheen the mood and moment so the styling brain can tune in.",
      issues: parsed.error.flatten()
    });
  }

  try {
    const result = await createStylingSuggestions(parsed.data);
    return response.json(result);
  } catch (err) {
    console.error(err);
    return response.status(500).json({ message: "Styling engine failed." });
  }
});