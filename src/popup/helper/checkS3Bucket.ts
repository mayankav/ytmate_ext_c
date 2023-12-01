export async function checkS3Bucket(
  directoryName: string
): Promise<{ transcript?: any; comments?: any } | null> {
  const bucketUrl = `https://ytmate-transcript-bucket.s3.ap-south-1.amazonaws.com/${directoryName}`;

  const transcriptUrl = `${bucketUrl}/transcript.json`;
  const commentsUrl = `${bucketUrl}/comments.json`;

  try {
    const [transcriptResponse, commentsResponse] = await Promise.all([
      fetch(transcriptUrl),
      fetch(commentsUrl),
    ]);

    const transcriptExists = transcriptResponse.ok;
    const commentsExists = commentsResponse.ok;

    if (!transcriptExists && !commentsExists) {
      throw new Error("Both transcript.json and comments.json are missing.");
    }

    const result: { transcript?: any; comments?: any } = {};

    if (transcriptExists) {
      result.transcript = await transcriptResponse.json();
    }

    if (commentsExists) {
      result.comments = await commentsResponse.json();
    }

    return result;
  } catch (error) {
    console.error("Error checking S3 bucket:", error);
    return null;
  }
}
