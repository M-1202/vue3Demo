import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function initFingerprint(): void{
  // 异步加载 FingerprintJS agent
  FingerprintJS.load().then((fp) => {
    fp.get().then((result) => {
      // 这是生成的唯一标识 ID
      const visitorId = result.visitorId;
      console.log("浏览器指纹 ID:", visitorId);
    });
  });
}
