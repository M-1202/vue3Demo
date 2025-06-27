// utils/selectionMapper.ts
import { diff_match_patch, DIFF_EQUAL } from "diff-match-patch";

/**
 * 获取原始文本中的选中位置
 * @param renderedText 渲染后的文本（textContent）
 * @param originalText Markdown 原文（含 $公式$）
 * @param renderedStartOffset 渲染文本中选中起点位置
 * @param renderedEndOffset 渲染文本中选中终点位置
 * @returns 原始文本中的 [start, end] 区间
 */
export function mapRenderedOffsetsToOriginal(
  renderedText: string,
  originalText: string,
  renderedStartOffset: number,
  renderedEndOffset: number
): [number, number] {
  const dmp = new diff_match_patch();
  const diffs = dmp.diff_main(originalText, renderedText);
  dmp.diff_cleanupSemantic(diffs);

  let originalIndex = 0;
  let renderedIndex = 0;

  let startOriginal = -1;
  let endOriginal = -1;

//   每次 diff 是一个形如 [操作类型, 文本内容] 的元组
// op === 0 两边都有的相同部分（可以同时移动原始和渲染的 index）
// op === -1 原始中有，渲染中没有（Markdown 特有的字符）
// op === 1 渲染中有，原始中没有（HTML 渲染补的字符）
  for (const [op, text] of diffs) {
    if (op === DIFF_EQUAL) {
      for (let i = 0; i < text.length; i++) {
        if (renderedIndex === renderedStartOffset) {
          startOriginal = originalIndex;
        }
        if (renderedIndex === renderedEndOffset) {
          endOriginal = originalIndex;
        }

        renderedIndex++;
        originalIndex++;
      }
    } else if (op === -1) {
      originalIndex += text.length;
    } else if (op === 1) {
      renderedIndex += text.length;
    }
  }

  // 收尾情况
  if (startOriginal === -1) startOriginal = originalIndex;
  if (endOriginal === -1) endOriginal = originalIndex;

  return [startOriginal, endOriginal];
}
