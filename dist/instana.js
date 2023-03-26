if (process.env.ENVIRONMENT === 'production') {
    require('@instana/collector')({
        autoProfile: true
    });
}
//# sourceMappingURL=instana.js.map