import { fromEnv } from "@aws-sdk/credential-providers";
import {AssetUploadInstruction} from '@sorry-cypress/common';
import {HttpRequest} from "@aws-sdk/protocol-http";
import {S3RequestPresigner} from "@aws-sdk/s3-request-presigner";
import {parseUrl} from "@aws-sdk/url-parser";
import {formatUrl} from "@aws-sdk/util-format-url";
import {Hash} from "@aws-sdk/hash-node";
import {sanitizeS3KeyPrefix} from '../utils/';
import {
    S3_URL,
    S3_BUCKET,
    S3_IMAGE_KEY_PREFIX,
    S3_REGION,
    S3_VIDEO_KEY_PREFIX,
    UPLOAD_EXPIRY_SECONDS
} from './config';
import {S3SignedUploadResult} from './types';

const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const presigner = new S3RequestPresigner({
    credentials: fromEnv(),
    region: S3_REGION,
    sha256: Hash.bind(null, "sha256"),
});

interface GetUploadURLParams {
    key: string;
    ContentType?: string;
    Expires?: number;
}

export const getUrls = async ({
    key,
    ContentType = ImageContentType,
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
    const url = parseUrl(`${S3_URL}/${S3_BUCKET}/${key}`);

    const signedGetUrlObject = await presigner.presign(
        new HttpRequest({...url, method: "GET"})
    );

    const signedPutUrlObject = await presigner.presign(
        new HttpRequest({...url, method: "PUT", headers: {'Content-Type': ContentType}}),
        { expiresIn: UPLOAD_EXPIRY_SECONDS }
    );

    return {
        readUrl: formatUrl(signedGetUrlObject),
        uploadUrl: formatUrl(signedPutUrlObject),
    };
};

export const getImageUploadUrl = async (key: string): Promise<AssetUploadInstruction> =>
    getUrls({
        key: `${sanitizeS3KeyPrefix(S3_IMAGE_KEY_PREFIX)}${key}.png`,
    });

export const getVideoUploadUrl = async (key: string): Promise<AssetUploadInstruction> =>
    getUrls({
        key: `${sanitizeS3KeyPrefix(S3_VIDEO_KEY_PREFIX)}${key}.mp4`,
        ContentType: VideoContentType,
    });
