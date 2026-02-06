export async function startMockServer(): Promise<void> {
  const { worker } = await import("./browser");
  await worker.start({
    onUnhandledRequest: "bypass",
    quiet: true,
  });
}
