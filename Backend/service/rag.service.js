const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1);
};

const calculateScore = (chunk, queryWords) => {
  const chunkWords = tokenize(chunk);

  let score = 0;

  queryWords.forEach((word) => {
    if (chunkWords.includes(word)) {
      score++;
    }
  });

  // Give more importance to resume sections
  const importantKeywords = [
    "project",
    "projects",
    "skills",
    "experience",
    "technologies",
    "technology",
    "developed",
    "built",
    "implemented",
  ];

  importantKeywords.forEach((keyword) => {
    if (chunk.toLowerCase().includes(keyword)) {
      score += 2;
    }
  });

  return score;
};

export const retrieveRelevantChunks = (
  chunks,
  role,
  difficulty,
  topK = 5
) => {
  const query = `
    ${role}
    ${difficulty}
    projects
    skills
    experience
    technologies
    development
    implementation
  `;

  const queryWords = tokenize(query);

  const rankedChunks = chunks.map((chunk) => ({
    chunk,
    score: calculateScore(chunk, queryWords),
  }));

  rankedChunks.sort(
    (a, b) => b.score - a.score
  );

  return rankedChunks
    .slice(0, topK)
    .map((item) => item.chunk);
};