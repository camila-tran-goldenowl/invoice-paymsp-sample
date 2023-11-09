const changeResourceText = (resource: string): string => {
  if (["quickbook", "Quickbook"].includes(resource)) {
    return "QuickBooks";
  } else if (["quickbook_desktop", "QuickbookDesktop"].includes(resource)) {
    return "QuickBooks Desktop";
  }
  return resource;
};

export { changeResourceText };
