import { describe, expect, it, vi } from "vitest";

describe("GitHub Operations", () => {
  it("mock básico 1", () => {
    const fn = vi.fn();
    fn();

    expect(fn).toHaveBeenCalled();
  });

  it("mock básico 2", () => {
    const fn = vi.fn(() => "ok");

    expect(fn()).toBe("ok");
  });

  it("mock básico 3", () => {
    const fn = vi.fn(() => ({ success: true }));

    expect(fn().success).toBe(true);
  });

  it("mock básico 4", () => {
    const fn = vi.fn();

    fn();
    fn();

    expect(fn).toHaveBeenCalledTimes(2);
  });
});