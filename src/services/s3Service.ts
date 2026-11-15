  import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

  const s3Client = new S3Client({
    region: process.env.AWS_REGION || "eu-central-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },  
  });

  export const uploadFileToS3 = async (
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
   ): Promise<string> => {

  // 1. Generate a unique file name to prevent naming conflicts
  const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

  // 2. Prepare upload parameters for S3
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    // 3. Send the file to S3 using PutObjectCommand
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // 4. Return the public URL of the uploaded file
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
    return fileUrl;
  } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload file to S3.');
  }
};

  export {s3Client};