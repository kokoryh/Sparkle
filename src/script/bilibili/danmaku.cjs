// universal 3.6.4
((danmaku, endTime, isNum, toastClass) => {
    if (danmaku.meta.content !== '空指部已就位') return;
    if (!isNum(endTime)) return;
    let progress = danmaku.meta.progress;
    let currentTime = this._context.videoPlayer.currentTime;
    if (currentTime > progress) return;
    this._context.videoPlayer.seekTo(endTime);
    this._airborneToast = new toastClass(this.size, this._suggestedFactor);
    this._airborneToast.onClick = _ => (this._context.videoPlayer.seekTo(Math.ceil(progress) + 1), !0);
    this.view.addSubView(this._airborneToast);
    this._airborneToast.show();
})(n, s, B, td);

// hd 3.6.3
((danmaku, endTime, isNum, toastClass) => {
    if (danmaku.meta.content !== '空指部已就位') return;
    if (!isNum(endTime)) return;
    let progress = danmaku.meta.progress;
    let currentTime = this._context.videoPlayer.currentTime;
    if (currentTime > progress) return;
    this._context.videoPlayer.seekTo(endTime);
    this._airborneToast = new toastClass(this.size, this._suggestedFactor);
    this._airborneToast.onClick = _ => (this._context.videoPlayer.seekTo(Math.ceil(progress) + 1), !0);
    this.view.addSubView(this._airborneToast);
    this._airborneToast.show();
})(n, s, B, ed);

// hd 2.7.4
((danmaku, endTime, isNum, toastClass, viewSuggestedFactor) => {
    if (danmaku.meta.content !== '空指部已就位') return;
    if (!isNum(endTime)) return;
    let progress = danmaku.meta.progress;
    let currentTime = this._context.videoPlayer.currentTime;
    if (currentTime > progress) return;
    this._context.videoPlayer.seekTo(endTime);
    this._airborneToast = new toastClass(this.size, viewSuggestedFactor(this.size));
    this._airborneToast.onClick = _ => (this._context.videoPlayer.seekTo(Math.ceil(progress) + 1), !0);
    this.view.addSubView(this._airborneToast);
    this._airborneToast.show();
})(a, e, O.isNumber, D.AirborneToast, g.ViewHelper.viewSuggestedFactor);

// inter 2.7.3
((danmaku, endTime, isNum, toastClass, viewSuggestedFactor) => {
    if (danmaku.meta.content !== '空指部已就位') return;
    if (!isNum(endTime)) return;
    let progress = danmaku.meta.progress;
    let currentTime = this._context.videoPlayer.currentTime;
    if (currentTime > progress) return;
    this._context.videoPlayer.seekTo(endTime);
    this._airborneToast = new toastClass(this.size, viewSuggestedFactor(this.size));
    this._airborneToast.onClick = _ => (this._context.videoPlayer.seekTo(Math.ceil(progress) + 1), !0);
    this.view.addSubView(this._airborneToast);
    this._airborneToast.show();
})(a, e, O.isNumber, D.AirborneToast, g.ViewHelper.viewSuggestedFactor);
