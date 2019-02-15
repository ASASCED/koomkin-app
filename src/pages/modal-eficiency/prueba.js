function(n) {
    if (n == 4) {
        return n;
    } else { return 2 * function(n + 1) };
}