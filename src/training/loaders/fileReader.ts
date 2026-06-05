export interface TrainingDatasetFileReader {
  readText(relativePath: string): Promise<string>;
  exists(relativePath: string): Promise<boolean>;
}

export const parseJsonFile = async <T>(
  reader: TrainingDatasetFileReader,
  relativePath: string,
): Promise<T> => JSON.parse(await reader.readText(relativePath)) as T;
