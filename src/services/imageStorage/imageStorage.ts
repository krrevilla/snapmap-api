import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Config } from '../../config';

export enum S3BucketKeys {
  phImages = 'phImages',
}

type PreSignedParams = {
  bucket: string;
  key: string;
  contentType: string;
};

const createPresignedUrlWithClient = ({
  bucket,
  key,
  contentType,
}: PreSignedParams): Promise<string> => {
  const client = new S3Client({ region: Config.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const imageStorage = {
  createPresignedUrlWithClient,
};
