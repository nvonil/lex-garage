export function jsonRequest(body: unknown) {
    return new Request("http://localhost/test", {
        method: "POST",
        body: JSON.stringify(body),
    });
}
