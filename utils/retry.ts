export const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> => {
    let retryCount = 0;
    let lastError;
  
    while (retryCount < maxRetries) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        retryCount++;
        console.error(`Retry attempt #${retryCount}:`, err);
      }
    }
  
    throw lastError || new Error("Max retries reached");
  };