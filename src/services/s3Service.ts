  import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const getS3Client = (): S3Client => {
  const region = process.env.AWS_REGION || 'eu-central-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('AWS credentials are missing in environment variables.');
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
};

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = process.env.AWS_REGION || 'eu-central-1';

  if (!bucketName) {
    throw new Error('AWS_BUCKET_NAME is not defined in environment variables.');
  }

  const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

  const uploadParams = {
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    const s3Client = getS3Client();
    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueFileName}`;
    return fileUrl;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3.');
  }
};
export { getS3Client };