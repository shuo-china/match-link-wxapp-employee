export const getShareMbrDetail = (detail) => {
  const tags = [
    detail?.age ? detail.age + "岁" : "",
    detail?.height ? detail.height + "cm" : "",
  ].filter(Boolean);

  return {
    title: `${detail.name}${tags.length ? "｜" + tags.join("｜") : ""}`,
    path: "/pages/transfer/transfer?memberId=" + detail.id,
    imageUrl: detail?.albums?.[0]?.path || undefined,
  };
};
