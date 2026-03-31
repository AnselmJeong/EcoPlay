import { jsx as m, jsxs as E, Fragment as ft } from "react/jsx-runtime";
import * as u from "react";
import J, { forwardRef as pt, createElement as Te, useMemo as Xe, useState as Ze, useEffect as le, useRef as ae } from "react";
import "react-dom";
const Qe = J.useEffectEvent ?? ((e) => {
  const r = ae(e);
  return le(() => {
    r.current = e;
  }), (...t) => r.current(...t);
});
const gr = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), hr = (e) => e.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (r, t, o) => o ? o.toUpperCase() : t.toLowerCase()
), Je = (e) => {
  const r = hr(e);
  return r.charAt(0).toUpperCase() + r.slice(1);
}, bt = (...e) => e.filter((r, t, o) => !!r && r.trim() !== "" && o.indexOf(r) === t).join(" ").trim(), vr = (e) => {
  for (const r in e)
    if (r.startsWith("aria-") || r === "role" || r === "title")
      return !0;
};
var xr = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const yr = pt(
  ({
    color: e = "currentColor",
    size: r = 24,
    strokeWidth: t = 2,
    absoluteStrokeWidth: o,
    className: n = "",
    children: i,
    iconNode: a,
    ...s
  }, l) => Te(
    "svg",
    {
      ref: l,
      ...xr,
      width: r,
      height: r,
      stroke: e,
      strokeWidth: o ? Number(t) * 24 / Number(r) : t,
      className: bt("lucide", n),
      ...!i && !vr(s) && { "aria-hidden": "true" },
      ...s
    },
    [
      ...a.map(([c, d]) => Te(c, d)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
const X = (e, r) => {
  const t = pt(
    ({ className: o, ...n }, i) => Te(yr, {
      ref: i,
      iconNode: r,
      className: bt(
        `lucide-${gr(Je(e))}`,
        `lucide-${e}`,
        o
      ),
      ...n
    })
  );
  return t.displayName = Je(e), t;
};
const wr = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
], kr = X("arrow-down", wr);
const Cr = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Nr = X("arrow-left", Cr);
const Rr = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], _r = X("arrow-right", Rr);
const Sr = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], Ir = X("arrow-up", Sr);
const Ar = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Er = X("check", Ar);
const Tr = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
], Pr = X("circle-dot", Tr);
const zr = [
  [
    "path",
    {
      d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
      key: "g5wo59"
    }
  ],
  ["path", { d: "m5.082 11.09 8.828 8.828", key: "1wx5vj" }]
], Mr = X("eraser", zr);
const Or = [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }]
], Dr = X("list-checks", Or);
function gt(e) {
  var r, t, o = "";
  if (typeof e == "string" || typeof e == "number") o += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var n = e.length;
    for (r = 0; r < n; r++) e[r] && (t = gt(e[r])) && (o && (o += " "), o += t);
  } else for (t in e) e[t] && (o && (o += " "), o += t);
  return o;
}
function ht() {
  for (var e, r, t = 0, o = "", n = arguments.length; t < n; t++) (e = arguments[t]) && (r = gt(e)) && (o && (o += " "), o += r);
  return o;
}
const et = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, tt = ht, Vr = (e, r) => (t) => {
  var o;
  if (r?.variants == null) return tt(e, t?.class, t?.className);
  const { variants: n, defaultVariants: i } = r, a = Object.keys(n).map((c) => {
    const d = t?.[c], f = i?.[c];
    if (d === null) return null;
    const v = et(d) || et(f);
    return n[c][v];
  }), s = t && Object.entries(t).reduce((c, d) => {
    let [f, v] = d;
    return v === void 0 || (c[f] = v), c;
  }, {}), l = r == null || (o = r.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((c, d) => {
    let { class: f, className: v, ...x } = d;
    return Object.entries(x).every((y) => {
      let [w, b] = y;
      return Array.isArray(b) ? b.includes({
        ...i,
        ...s
      }[w]) : {
        ...i,
        ...s
      }[w] === b;
    }) ? [
      ...c,
      f,
      v
    ] : c;
  }, []);
  return tt(e, a, l, t?.class, t?.className);
};
function rt(e, r) {
  if (typeof e == "function")
    return e(r);
  e != null && (e.current = r);
}
function ke(...e) {
  return (r) => {
    let t = !1;
    const o = e.map((n) => {
      const i = rt(n, r);
      return !t && typeof i == "function" && (t = !0), i;
    });
    if (t)
      return () => {
        for (let n = 0; n < o.length; n++) {
          const i = o[n];
          typeof i == "function" ? i() : rt(e[n], null);
        }
      };
  };
}
function U(...e) {
  return u.useCallback(ke(...e), e);
}
// @__NO_SIDE_EFFECTS__
function Br(e) {
  const r = /* @__PURE__ */ $r(e), t = u.forwardRef((o, n) => {
    const { children: i, ...a } = o, s = u.Children.toArray(i), l = s.find(Lr);
    if (l) {
      const c = l.props.children, d = s.map((f) => f === l ? u.Children.count(c) > 1 ? u.Children.only(null) : u.isValidElement(c) ? c.props.children : null : f);
      return /* @__PURE__ */ m(r, { ...a, ref: n, children: u.isValidElement(c) ? u.cloneElement(c, void 0, d) : null });
    }
    return /* @__PURE__ */ m(r, { ...a, ref: n, children: i });
  });
  return t.displayName = `${e}.Slot`, t;
}
// @__NO_SIDE_EFFECTS__
function $r(e) {
  const r = u.forwardRef((t, o) => {
    const { children: n, ...i } = t;
    if (u.isValidElement(n)) {
      const a = jr(n), s = Gr(i, n.props);
      return n.type !== u.Fragment && (s.ref = o ? ke(o, a) : a), u.cloneElement(n, s);
    }
    return u.Children.count(n) > 1 ? u.Children.only(null) : null;
  });
  return r.displayName = `${e}.SlotClone`, r;
}
var Fr = /* @__PURE__ */ Symbol("radix.slottable");
function Lr(e) {
  return u.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Fr;
}
function Gr(e, r) {
  const t = { ...r };
  for (const o in r) {
    const n = e[o], i = r[o];
    /^on[A-Z]/.test(o) ? n && i ? t[o] = (...s) => {
      const l = i(...s);
      return n(...s), l;
    } : n && (t[o] = n) : o === "style" ? t[o] = { ...n, ...i } : o === "className" && (t[o] = [n, i].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
function jr(e) {
  let r = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning;
  return t ? e.ref : (r = Object.getOwnPropertyDescriptor(e, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning, t ? e.props.ref : e.props.ref || e.ref);
}
var Wr = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], L = Wr.reduce((e, r) => {
  const t = /* @__PURE__ */ Br(`Primitive.${r}`), o = u.forwardRef((n, i) => {
    const { asChild: a, ...s } = n, l = a ? t : r;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(l, { ...s, ref: i });
  });
  return o.displayName = `Primitive.${r}`, { ...e, [r]: o };
}, {});
function ie(e, r = []) {
  let t = [];
  function o(i, a) {
    const s = u.createContext(a), l = t.length;
    t = [...t, a];
    const c = (f) => {
      const { scope: v, children: x, ...y } = f, w = v?.[e]?.[l] || s, b = u.useMemo(() => y, Object.values(y));
      return /* @__PURE__ */ m(w.Provider, { value: b, children: x });
    };
    c.displayName = i + "Provider";
    function d(f, v) {
      const x = v?.[e]?.[l] || s, y = u.useContext(x);
      if (y) return y;
      if (a !== void 0) return a;
      throw new Error(`\`${f}\` must be used within \`${i}\``);
    }
    return [c, d];
  }
  const n = () => {
    const i = t.map((a) => u.createContext(a));
    return function(s) {
      const l = s?.[e] || i;
      return u.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: l } }),
        [s, l]
      );
    };
  };
  return n.scopeName = e, [o, Ur(n, ...r)];
}
function Ur(...e) {
  const r = e[0];
  if (e.length === 1) return r;
  const t = () => {
    const o = e.map((n) => ({
      useScope: n(),
      scopeName: n.scopeName
    }));
    return function(i) {
      const a = o.reduce((s, { useScope: l, scopeName: c }) => {
        const f = l(i)[`__scope${c}`];
        return { ...s, ...f };
      }, {});
      return u.useMemo(() => ({ [`__scope${r.scopeName}`]: a }), [a]);
    };
  };
  return t.scopeName = r.scopeName, t;
}
// @__NO_SIDE_EFFECTS__
function ot(e) {
  const r = /* @__PURE__ */ qr(e), t = u.forwardRef((o, n) => {
    const { children: i, ...a } = o, s = u.Children.toArray(i), l = s.find(Hr);
    if (l) {
      const c = l.props.children, d = s.map((f) => f === l ? u.Children.count(c) > 1 ? u.Children.only(null) : u.isValidElement(c) ? c.props.children : null : f);
      return /* @__PURE__ */ m(r, { ...a, ref: n, children: u.isValidElement(c) ? u.cloneElement(c, void 0, d) : null });
    }
    return /* @__PURE__ */ m(r, { ...a, ref: n, children: i });
  });
  return t.displayName = `${e}.Slot`, t;
}
// @__NO_SIDE_EFFECTS__
function qr(e) {
  const r = u.forwardRef((t, o) => {
    const { children: n, ...i } = t;
    if (u.isValidElement(n)) {
      const a = Xr(n), s = Yr(i, n.props);
      return n.type !== u.Fragment && (s.ref = o ? ke(o, a) : a), u.cloneElement(n, s);
    }
    return u.Children.count(n) > 1 ? u.Children.only(null) : null;
  });
  return r.displayName = `${e}.SlotClone`, r;
}
var Kr = /* @__PURE__ */ Symbol("radix.slottable");
function Hr(e) {
  return u.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Kr;
}
function Yr(e, r) {
  const t = { ...r };
  for (const o in r) {
    const n = e[o], i = r[o];
    /^on[A-Z]/.test(o) ? n && i ? t[o] = (...s) => {
      const l = i(...s);
      return n(...s), l;
    } : n && (t[o] = n) : o === "style" ? t[o] = { ...n, ...i } : o === "className" && (t[o] = [n, i].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
function Xr(e) {
  let r = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning;
  return t ? e.ref : (r = Object.getOwnPropertyDescriptor(e, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning, t ? e.props.ref : e.props.ref || e.ref);
}
function Zr(e) {
  const r = e + "CollectionProvider", [t, o] = ie(r), [n, i] = t(
    r,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), a = (w) => {
    const { scope: b, children: N } = w, S = J.useRef(null), R = J.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ m(n, { scope: b, itemMap: R, collectionRef: S, children: N });
  };
  a.displayName = r;
  const s = e + "CollectionSlot", l = /* @__PURE__ */ ot(s), c = J.forwardRef(
    (w, b) => {
      const { scope: N, children: S } = w, R = i(s, N), I = U(b, R.collectionRef);
      return /* @__PURE__ */ m(l, { ref: I, children: S });
    }
  );
  c.displayName = s;
  const d = e + "CollectionItemSlot", f = "data-radix-collection-item", v = /* @__PURE__ */ ot(d), x = J.forwardRef(
    (w, b) => {
      const { scope: N, children: S, ...R } = w, I = J.useRef(null), P = U(b, I), C = i(d, N);
      return J.useEffect(() => (C.itemMap.set(I, { ref: I, ...R }), () => {
        C.itemMap.delete(I);
      })), /* @__PURE__ */ m(v, { [f]: "", ref: P, children: S });
    }
  );
  x.displayName = d;
  function y(w) {
    const b = i(e + "CollectionConsumer", w);
    return J.useCallback(() => {
      const S = b.collectionRef.current;
      if (!S) return [];
      const R = Array.from(S.querySelectorAll(`[${f}]`));
      return Array.from(b.itemMap.values()).sort(
        (C, T) => R.indexOf(C.ref.current) - R.indexOf(T.ref.current)
      );
    }, [b.collectionRef, b.itemMap]);
  }
  return [
    { Provider: a, Slot: c, ItemSlot: x },
    y,
    o
  ];
}
function F(e, r, { checkForDefaultPrevented: t = !0 } = {}) {
  return function(n) {
    if (e?.(n), t === !1 || !n.defaultPrevented)
      return r?.(n);
  };
}
var de = globalThis?.document ? u.useLayoutEffect : () => {
}, Qr = u[" useInsertionEffect ".trim().toString()] || de;
function Me({
  prop: e,
  defaultProp: r,
  onChange: t = () => {
  },
  caller: o
}) {
  const [n, i, a] = Jr({
    defaultProp: r,
    onChange: t
  }), s = e !== void 0, l = s ? e : n;
  {
    const d = u.useRef(e !== void 0);
    u.useEffect(() => {
      const f = d.current;
      f !== s && console.warn(
        `${o} is changing from ${f ? "controlled" : "uncontrolled"} to ${s ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = s;
    }, [s, o]);
  }
  const c = u.useCallback(
    (d) => {
      if (s) {
        const f = eo(d) ? d(e) : d;
        f !== e && a.current?.(f);
      } else
        i(d);
    },
    [s, e, i, a]
  );
  return [l, c];
}
function Jr({
  defaultProp: e,
  onChange: r
}) {
  const [t, o] = u.useState(e), n = u.useRef(t), i = u.useRef(r);
  return Qr(() => {
    i.current = r;
  }, [r]), u.useEffect(() => {
    n.current !== t && (i.current?.(t), n.current = t);
  }, [t, n]), [t, o, i];
}
function eo(e) {
  return typeof e == "function";
}
function to(e, r) {
  return u.useReducer((t, o) => r[t][o] ?? t, e);
}
var Oe = (e) => {
  const { present: r, children: t } = e, o = ro(r), n = typeof t == "function" ? t({ present: o.isPresent }) : u.Children.only(t), i = U(o.ref, oo(n));
  return typeof t == "function" || o.isPresent ? u.cloneElement(n, { ref: i }) : null;
};
Oe.displayName = "Presence";
function ro(e) {
  const [r, t] = u.useState(), o = u.useRef(null), n = u.useRef(e), i = u.useRef("none"), a = e ? "mounted" : "unmounted", [s, l] = to(a, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return u.useEffect(() => {
    const c = ge(o.current);
    i.current = s === "mounted" ? c : "none";
  }, [s]), de(() => {
    const c = o.current, d = n.current;
    if (d !== e) {
      const v = i.current, x = ge(c);
      e ? l("MOUNT") : x === "none" || c?.display === "none" ? l("UNMOUNT") : l(d && v !== x ? "ANIMATION_OUT" : "UNMOUNT"), n.current = e;
    }
  }, [e, l]), de(() => {
    if (r) {
      let c;
      const d = r.ownerDocument.defaultView ?? window, f = (x) => {
        const w = ge(o.current).includes(CSS.escape(x.animationName));
        if (x.target === r && w && (l("ANIMATION_END"), !n.current)) {
          const b = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", c = d.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = b);
          });
        }
      }, v = (x) => {
        x.target === r && (i.current = ge(o.current));
      };
      return r.addEventListener("animationstart", v), r.addEventListener("animationcancel", f), r.addEventListener("animationend", f), () => {
        d.clearTimeout(c), r.removeEventListener("animationstart", v), r.removeEventListener("animationcancel", f), r.removeEventListener("animationend", f);
      };
    } else
      l("ANIMATION_END");
  }, [r, l]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: u.useCallback((c) => {
      o.current = c ? getComputedStyle(c) : null, t(c);
    }, [])
  };
}
function ge(e) {
  return e?.animationName || "none";
}
function oo(e) {
  let r = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning;
  return t ? e.ref : (r = Object.getOwnPropertyDescriptor(e, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning, t ? e.props.ref : e.props.ref || e.ref);
}
var no = u[" useId ".trim().toString()] || (() => {
}), io = 0;
function ao(e) {
  const [r, t] = u.useState(no());
  return de(() => {
    t((o) => o ?? String(io++));
  }, [e]), r ? `radix-${r}` : "";
}
var so = u.createContext(void 0);
function vt(e) {
  const r = u.useContext(so);
  return e || r || "ltr";
}
function lo(e) {
  const r = u.useRef(e);
  return u.useEffect(() => {
    r.current = e;
  }), u.useMemo(() => (...t) => r.current?.(...t), []);
}
function xt(e) {
  const r = u.useRef({ value: e, previous: e });
  return u.useMemo(() => (r.current.value !== e && (r.current.previous = r.current.value, r.current.value = e), r.current.previous), [e]);
}
function yt(e) {
  const [r, t] = u.useState(void 0);
  return de(() => {
    if (e) {
      t({ width: e.offsetWidth, height: e.offsetHeight });
      const o = new ResizeObserver((n) => {
        if (!Array.isArray(n) || !n.length)
          return;
        const i = n[0];
        let a, s;
        if ("borderBoxSize" in i) {
          const l = i.borderBoxSize, c = Array.isArray(l) ? l[0] : l;
          a = c.inlineSize, s = c.blockSize;
        } else
          a = e.offsetWidth, s = e.offsetHeight;
        t({ width: a, height: s });
      });
      return o.observe(e, { box: "border-box" }), () => o.unobserve(e);
    } else
      t(void 0);
  }, [e]), r;
}
var Ce = "Checkbox", [co] = ie(Ce), [uo, De] = co(Ce);
function mo(e) {
  const {
    __scopeCheckbox: r,
    checked: t,
    children: o,
    defaultChecked: n,
    disabled: i,
    form: a,
    name: s,
    onCheckedChange: l,
    required: c,
    value: d = "on",
    // @ts-expect-error
    internal_do_not_use_render: f
  } = e, [v, x] = Me({
    prop: t,
    defaultProp: n ?? !1,
    onChange: l,
    caller: Ce
  }), [y, w] = u.useState(null), [b, N] = u.useState(null), S = u.useRef(!1), R = y ? !!a || !!y.closest("form") : (
    // We set this to true by default so that events bubble to forms without JS (SSR)
    !0
  ), I = {
    checked: v,
    disabled: i,
    setChecked: x,
    control: y,
    setControl: w,
    name: s,
    form: a,
    value: d,
    hasConsumerStoppedPropagationRef: S,
    required: c,
    defaultChecked: Y(n) ? !1 : n,
    isFormControl: R,
    bubbleInput: b,
    setBubbleInput: N
  };
  return /* @__PURE__ */ m(
    uo,
    {
      scope: r,
      ...I,
      children: fo(f) ? f(I) : o
    }
  );
}
var wt = "CheckboxTrigger", kt = u.forwardRef(
  ({ __scopeCheckbox: e, onKeyDown: r, onClick: t, ...o }, n) => {
    const {
      control: i,
      value: a,
      disabled: s,
      checked: l,
      required: c,
      setControl: d,
      setChecked: f,
      hasConsumerStoppedPropagationRef: v,
      isFormControl: x,
      bubbleInput: y
    } = De(wt, e), w = U(n, d), b = u.useRef(l);
    return u.useEffect(() => {
      const N = i?.form;
      if (N) {
        const S = () => f(b.current);
        return N.addEventListener("reset", S), () => N.removeEventListener("reset", S);
      }
    }, [i, f]), /* @__PURE__ */ m(
      L.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": Y(l) ? "mixed" : l,
        "aria-required": c,
        "data-state": It(l),
        "data-disabled": s ? "" : void 0,
        disabled: s,
        value: a,
        ...o,
        ref: w,
        onKeyDown: F(r, (N) => {
          N.key === "Enter" && N.preventDefault();
        }),
        onClick: F(t, (N) => {
          f((S) => Y(S) ? !0 : !S), y && x && (v.current = N.isPropagationStopped(), v.current || N.stopPropagation());
        })
      }
    );
  }
);
kt.displayName = wt;
var Ct = u.forwardRef(
  (e, r) => {
    const {
      __scopeCheckbox: t,
      name: o,
      checked: n,
      defaultChecked: i,
      required: a,
      disabled: s,
      value: l,
      onCheckedChange: c,
      form: d,
      ...f
    } = e;
    return /* @__PURE__ */ m(
      mo,
      {
        __scopeCheckbox: t,
        checked: n,
        defaultChecked: i,
        disabled: s,
        required: a,
        onCheckedChange: c,
        name: o,
        form: d,
        value: l,
        internal_do_not_use_render: ({ isFormControl: v }) => /* @__PURE__ */ E(ft, { children: [
          /* @__PURE__ */ m(
            kt,
            {
              ...f,
              ref: r,
              __scopeCheckbox: t
            }
          ),
          v && /* @__PURE__ */ m(
            St,
            {
              __scopeCheckbox: t
            }
          )
        ] })
      }
    );
  }
);
Ct.displayName = Ce;
var Nt = "CheckboxIndicator", Rt = u.forwardRef(
  (e, r) => {
    const { __scopeCheckbox: t, forceMount: o, ...n } = e, i = De(Nt, t);
    return /* @__PURE__ */ m(
      Oe,
      {
        present: o || Y(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ m(
          L.span,
          {
            "data-state": It(i.checked),
            "data-disabled": i.disabled ? "" : void 0,
            ...n,
            ref: r,
            style: { pointerEvents: "none", ...e.style }
          }
        )
      }
    );
  }
);
Rt.displayName = Nt;
var _t = "CheckboxBubbleInput", St = u.forwardRef(
  ({ __scopeCheckbox: e, ...r }, t) => {
    const {
      control: o,
      hasConsumerStoppedPropagationRef: n,
      checked: i,
      defaultChecked: a,
      required: s,
      disabled: l,
      name: c,
      value: d,
      form: f,
      bubbleInput: v,
      setBubbleInput: x
    } = De(_t, e), y = U(t, x), w = xt(i), b = yt(o);
    u.useEffect(() => {
      const S = v;
      if (!S) return;
      const R = window.HTMLInputElement.prototype, P = Object.getOwnPropertyDescriptor(
        R,
        "checked"
      ).set, C = !n.current;
      if (w !== i && P) {
        const T = new Event("click", { bubbles: C });
        S.indeterminate = Y(i), P.call(S, Y(i) ? !1 : i), S.dispatchEvent(T);
      }
    }, [v, w, i, n]);
    const N = u.useRef(Y(i) ? !1 : i);
    return /* @__PURE__ */ m(
      L.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: a ?? N.current,
        required: s,
        disabled: l,
        name: c,
        value: d,
        form: f,
        ...r,
        tabIndex: -1,
        ref: y,
        style: {
          ...r.style,
          ...b,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: "translateX(-100%)"
        }
      }
    );
  }
);
St.displayName = _t;
function fo(e) {
  return typeof e == "function";
}
function Y(e) {
  return e === "indeterminate";
}
function It(e) {
  return Y(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
var Ae = "rovingFocusGroup.onEntryFocus", po = { bubbles: !1, cancelable: !0 }, ue = "RovingFocusGroup", [Pe, At, bo] = Zr(ue), [go, Et] = ie(
  ue,
  [bo]
), [ho, vo] = go(ue), Tt = u.forwardRef(
  (e, r) => /* @__PURE__ */ m(Pe.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ m(Pe.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ m(xo, { ...e, ref: r }) }) })
);
Tt.displayName = ue;
var xo = u.forwardRef((e, r) => {
  const {
    __scopeRovingFocusGroup: t,
    orientation: o,
    loop: n = !1,
    dir: i,
    currentTabStopId: a,
    defaultCurrentTabStopId: s,
    onCurrentTabStopIdChange: l,
    onEntryFocus: c,
    preventScrollOnEntryFocus: d = !1,
    ...f
  } = e, v = u.useRef(null), x = U(r, v), y = vt(i), [w, b] = Me({
    prop: a,
    defaultProp: s ?? null,
    onChange: l,
    caller: ue
  }), [N, S] = u.useState(!1), R = lo(c), I = At(t), P = u.useRef(!1), [C, T] = u.useState(0);
  return u.useEffect(() => {
    const p = v.current;
    if (p)
      return p.addEventListener(Ae, R), () => p.removeEventListener(Ae, R);
  }, [R]), /* @__PURE__ */ m(
    ho,
    {
      scope: t,
      orientation: o,
      dir: y,
      loop: n,
      currentTabStopId: w,
      onItemFocus: u.useCallback(
        (p) => b(p),
        [b]
      ),
      onItemShiftTab: u.useCallback(() => S(!0), []),
      onFocusableItemAdd: u.useCallback(
        () => T((p) => p + 1),
        []
      ),
      onFocusableItemRemove: u.useCallback(
        () => T((p) => p - 1),
        []
      ),
      children: /* @__PURE__ */ m(
        L.div,
        {
          tabIndex: N || C === 0 ? -1 : 0,
          "data-orientation": o,
          ...f,
          ref: x,
          style: { outline: "none", ...e.style },
          onMouseDown: F(e.onMouseDown, () => {
            P.current = !0;
          }),
          onFocus: F(e.onFocus, (p) => {
            const A = !P.current;
            if (p.target === p.currentTarget && A && !N) {
              const G = new CustomEvent(Ae, po);
              if (p.currentTarget.dispatchEvent(G), !G.defaultPrevented) {
                const $ = I().filter((M) => M.focusable), j = $.find((M) => M.active), oe = $.find((M) => M.id === w), q = [j, oe, ...$].filter(
                  Boolean
                ).map((M) => M.ref.current);
                Mt(q, d);
              }
            }
            P.current = !1;
          }),
          onBlur: F(e.onBlur, () => S(!1))
        }
      )
    }
  );
}), Pt = "RovingFocusGroupItem", zt = u.forwardRef(
  (e, r) => {
    const {
      __scopeRovingFocusGroup: t,
      focusable: o = !0,
      active: n = !1,
      tabStopId: i,
      children: a,
      ...s
    } = e, l = ao(), c = i || l, d = vo(Pt, t), f = d.currentTabStopId === c, v = At(t), { onFocusableItemAdd: x, onFocusableItemRemove: y, currentTabStopId: w } = d;
    return u.useEffect(() => {
      if (o)
        return x(), () => y();
    }, [o, x, y]), /* @__PURE__ */ m(
      Pe.ItemSlot,
      {
        scope: t,
        id: c,
        focusable: o,
        active: n,
        children: /* @__PURE__ */ m(
          L.span,
          {
            tabIndex: f ? 0 : -1,
            "data-orientation": d.orientation,
            ...s,
            ref: r,
            onMouseDown: F(e.onMouseDown, (b) => {
              o ? d.onItemFocus(c) : b.preventDefault();
            }),
            onFocus: F(e.onFocus, () => d.onItemFocus(c)),
            onKeyDown: F(e.onKeyDown, (b) => {
              if (b.key === "Tab" && b.shiftKey) {
                d.onItemShiftTab();
                return;
              }
              if (b.target !== b.currentTarget) return;
              const N = ko(b, d.orientation, d.dir);
              if (N !== void 0) {
                if (b.metaKey || b.ctrlKey || b.altKey || b.shiftKey) return;
                b.preventDefault();
                let R = v().filter((I) => I.focusable).map((I) => I.ref.current);
                if (N === "last") R.reverse();
                else if (N === "prev" || N === "next") {
                  N === "prev" && R.reverse();
                  const I = R.indexOf(b.currentTarget);
                  R = d.loop ? Co(R, I + 1) : R.slice(I + 1);
                }
                setTimeout(() => Mt(R));
              }
            }),
            children: typeof a == "function" ? a({ isCurrentTabStop: f, hasTabStop: w != null }) : a
          }
        )
      }
    );
  }
);
zt.displayName = Pt;
var yo = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function wo(e, r) {
  return r !== "rtl" ? e : e === "ArrowLeft" ? "ArrowRight" : e === "ArrowRight" ? "ArrowLeft" : e;
}
function ko(e, r, t) {
  const o = wo(e.key, t);
  if (!(r === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) && !(r === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o)))
    return yo[o];
}
function Mt(e, r = !1) {
  const t = document.activeElement;
  for (const o of e)
    if (o === t || (o.focus({ preventScroll: r }), document.activeElement !== t)) return;
}
function Co(e, r) {
  return e.map((t, o) => e[(r + o) % e.length]);
}
var No = Tt, Ro = zt, Ve = "Progress", Be = 100, [_o] = ie(Ve), [So, Io] = _o(Ve), Ot = u.forwardRef(
  (e, r) => {
    const {
      __scopeProgress: t,
      value: o = null,
      max: n,
      getValueLabel: i = Ao,
      ...a
    } = e;
    (n || n === 0) && !nt(n) && console.error(Eo(`${n}`, "Progress"));
    const s = nt(n) ? n : Be;
    o !== null && !it(o, s) && console.error(To(`${o}`, "Progress"));
    const l = it(o, s) ? o : null, c = ye(l) ? i(l, s) : void 0;
    return /* @__PURE__ */ m(So, { scope: t, value: l, max: s, children: /* @__PURE__ */ m(
      L.div,
      {
        "aria-valuemax": s,
        "aria-valuemin": 0,
        "aria-valuenow": ye(l) ? l : void 0,
        "aria-valuetext": c,
        role: "progressbar",
        "data-state": Bt(l, s),
        "data-value": l ?? void 0,
        "data-max": s,
        ...a,
        ref: r
      }
    ) });
  }
);
Ot.displayName = Ve;
var Dt = "ProgressIndicator", Vt = u.forwardRef(
  (e, r) => {
    const { __scopeProgress: t, ...o } = e, n = Io(Dt, t);
    return /* @__PURE__ */ m(
      L.div,
      {
        "data-state": Bt(n.value, n.max),
        "data-value": n.value ?? void 0,
        "data-max": n.max,
        ...o,
        ref: r
      }
    );
  }
);
Vt.displayName = Dt;
function Ao(e, r) {
  return `${Math.round(e / r * 100)}%`;
}
function Bt(e, r) {
  return e == null ? "indeterminate" : e === r ? "complete" : "loading";
}
function ye(e) {
  return typeof e == "number";
}
function nt(e) {
  return ye(e) && !isNaN(e) && e > 0;
}
function it(e, r) {
  return ye(e) && !isNaN(e) && e <= r && e >= 0;
}
function Eo(e, r) {
  return `Invalid prop \`max\` of value \`${e}\` supplied to \`${r}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${Be}\`.`;
}
function To(e, r) {
  return `Invalid prop \`value\` of value \`${e}\` supplied to \`${r}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${Be} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Po = Ot, zo = Vt, $e = "Radio", [Mo, $t] = ie($e), [Oo, Do] = Mo($e), Ft = u.forwardRef(
  (e, r) => {
    const {
      __scopeRadio: t,
      name: o,
      checked: n = !1,
      required: i,
      disabled: a,
      value: s = "on",
      onCheck: l,
      form: c,
      ...d
    } = e, [f, v] = u.useState(null), x = U(r, (b) => v(b)), y = u.useRef(!1), w = f ? c || !!f.closest("form") : !0;
    return /* @__PURE__ */ E(Oo, { scope: t, checked: n, disabled: a, children: [
      /* @__PURE__ */ m(
        L.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": n,
          "data-state": Wt(n),
          "data-disabled": a ? "" : void 0,
          disabled: a,
          value: s,
          ...d,
          ref: x,
          onClick: F(e.onClick, (b) => {
            n || l?.(), w && (y.current = b.isPropagationStopped(), y.current || b.stopPropagation());
          })
        }
      ),
      w && /* @__PURE__ */ m(
        jt,
        {
          control: f,
          bubbles: !y.current,
          name: o,
          value: s,
          checked: n,
          required: i,
          disabled: a,
          form: c,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Ft.displayName = $e;
var Lt = "RadioIndicator", Gt = u.forwardRef(
  (e, r) => {
    const { __scopeRadio: t, forceMount: o, ...n } = e, i = Do(Lt, t);
    return /* @__PURE__ */ m(Oe, { present: o || i.checked, children: /* @__PURE__ */ m(
      L.span,
      {
        "data-state": Wt(i.checked),
        "data-disabled": i.disabled ? "" : void 0,
        ...n,
        ref: r
      }
    ) });
  }
);
Gt.displayName = Lt;
var Vo = "RadioBubbleInput", jt = u.forwardRef(
  ({
    __scopeRadio: e,
    control: r,
    checked: t,
    bubbles: o = !0,
    ...n
  }, i) => {
    const a = u.useRef(null), s = U(a, i), l = xt(t), c = yt(r);
    return u.useEffect(() => {
      const d = a.current;
      if (!d) return;
      const f = window.HTMLInputElement.prototype, x = Object.getOwnPropertyDescriptor(
        f,
        "checked"
      ).set;
      if (l !== t && x) {
        const y = new Event("click", { bubbles: o });
        x.call(d, t), d.dispatchEvent(y);
      }
    }, [l, t, o]), /* @__PURE__ */ m(
      L.input,
      {
        type: "radio",
        "aria-hidden": !0,
        defaultChecked: t,
        ...n,
        tabIndex: -1,
        ref: s,
        style: {
          ...n.style,
          ...c,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
jt.displayName = Vo;
function Wt(e) {
  return e ? "checked" : "unchecked";
}
var Bo = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], Ne = "RadioGroup", [$o] = ie(Ne, [
  Et,
  $t
]), Ut = Et(), qt = $t(), [Fo, Lo] = $o(Ne), Kt = u.forwardRef(
  (e, r) => {
    const {
      __scopeRadioGroup: t,
      name: o,
      defaultValue: n,
      value: i,
      required: a = !1,
      disabled: s = !1,
      orientation: l,
      dir: c,
      loop: d = !0,
      onValueChange: f,
      ...v
    } = e, x = Ut(t), y = vt(c), [w, b] = Me({
      prop: i,
      defaultProp: n ?? null,
      onChange: f,
      caller: Ne
    });
    return /* @__PURE__ */ m(
      Fo,
      {
        scope: t,
        name: o,
        required: a,
        disabled: s,
        value: w,
        onValueChange: b,
        children: /* @__PURE__ */ m(
          No,
          {
            asChild: !0,
            ...x,
            orientation: l,
            dir: y,
            loop: d,
            children: /* @__PURE__ */ m(
              L.div,
              {
                role: "radiogroup",
                "aria-required": a,
                "aria-orientation": l,
                "data-disabled": s ? "" : void 0,
                dir: y,
                ...v,
                ref: r
              }
            )
          }
        )
      }
    );
  }
);
Kt.displayName = Ne;
var Ht = "RadioGroupItem", Yt = u.forwardRef(
  (e, r) => {
    const { __scopeRadioGroup: t, disabled: o, ...n } = e, i = Lo(Ht, t), a = i.disabled || o, s = Ut(t), l = qt(t), c = u.useRef(null), d = U(r, c), f = i.value === n.value, v = u.useRef(!1);
    return u.useEffect(() => {
      const x = (w) => {
        Bo.includes(w.key) && (v.current = !0);
      }, y = () => v.current = !1;
      return document.addEventListener("keydown", x), document.addEventListener("keyup", y), () => {
        document.removeEventListener("keydown", x), document.removeEventListener("keyup", y);
      };
    }, []), /* @__PURE__ */ m(
      Ro,
      {
        asChild: !0,
        ...s,
        focusable: !a,
        active: f,
        children: /* @__PURE__ */ m(
          Ft,
          {
            disabled: a,
            required: i.required,
            checked: f,
            ...l,
            ...n,
            name: i.name,
            ref: d,
            onCheck: () => i.onValueChange(n.value),
            onKeyDown: F((x) => {
              x.key === "Enter" && x.preventDefault();
            }),
            onFocus: F(n.onFocus, () => {
              v.current && c.current?.click();
            })
          }
        )
      }
    );
  }
);
Yt.displayName = Ht;
var Go = "RadioGroupIndicator", Xt = u.forwardRef(
  (e, r) => {
    const { __scopeRadioGroup: t, ...o } = e, n = qt(t);
    return /* @__PURE__ */ m(Gt, { ...n, ...o, ref: r });
  }
);
Xt.displayName = Go;
var jo = Kt, Wo = Yt, Uo = Xt;
// @__NO_SIDE_EFFECTS__
function qo(e) {
  const r = /* @__PURE__ */ Ho(e), t = u.forwardRef((o, n) => {
    const { children: i, ...a } = o, s = u.Children.toArray(i), l = s.find(Xo);
    if (l) {
      const c = l.props.children, d = s.map((f) => f === l ? u.Children.count(c) > 1 ? u.Children.only(null) : u.isValidElement(c) ? c.props.children : null : f);
      return /* @__PURE__ */ m(r, { ...a, ref: n, children: u.isValidElement(c) ? u.cloneElement(c, void 0, d) : null });
    }
    return /* @__PURE__ */ m(r, { ...a, ref: n, children: i });
  });
  return t.displayName = `${e}.Slot`, t;
}
var Ko = /* @__PURE__ */ qo("Slot");
// @__NO_SIDE_EFFECTS__
function Ho(e) {
  const r = u.forwardRef((t, o) => {
    const { children: n, ...i } = t;
    if (u.isValidElement(n)) {
      const a = Qo(n), s = Zo(i, n.props);
      return n.type !== u.Fragment && (s.ref = o ? ke(o, a) : a), u.cloneElement(n, s);
    }
    return u.Children.count(n) > 1 ? u.Children.only(null) : null;
  });
  return r.displayName = `${e}.SlotClone`, r;
}
var Yo = /* @__PURE__ */ Symbol("radix.slottable");
function Xo(e) {
  return u.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Yo;
}
function Zo(e, r) {
  const t = { ...r };
  for (const o in r) {
    const n = e[o], i = r[o];
    /^on[A-Z]/.test(o) ? n && i ? t[o] = (...s) => {
      const l = i(...s);
      return n(...s), l;
    } : n && (t[o] = n) : o === "style" ? t[o] = { ...n, ...i } : o === "className" && (t[o] = [n, i].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
function Qo(e) {
  let r = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning;
  return t ? e.ref : (r = Object.getOwnPropertyDescriptor(e, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning, t ? e.props.ref : e.props.ref || e.ref);
}
const Jo = (e, r) => {
  const t = new Array(e.length + r.length);
  for (let o = 0; o < e.length; o++)
    t[o] = e[o];
  for (let o = 0; o < r.length; o++)
    t[e.length + o] = r[o];
  return t;
}, en = (e, r) => ({
  classGroupId: e,
  validator: r
}), Zt = (e = /* @__PURE__ */ new Map(), r = null, t) => ({
  nextPart: e,
  validators: r,
  classGroupId: t
}), we = "-", at = [], tn = "arbitrary..", rn = (e) => {
  const r = nn(e), {
    conflictingClassGroups: t,
    conflictingClassGroupModifiers: o
  } = e;
  return {
    getClassGroupId: (a) => {
      if (a.startsWith("[") && a.endsWith("]"))
        return on(a);
      const s = a.split(we), l = s[0] === "" && s.length > 1 ? 1 : 0;
      return Qt(s, l, r);
    },
    getConflictingClassGroupIds: (a, s) => {
      if (s) {
        const l = o[a], c = t[a];
        return l ? c ? Jo(c, l) : l : c || at;
      }
      return t[a] || at;
    }
  };
}, Qt = (e, r, t) => {
  if (e.length - r === 0)
    return t.classGroupId;
  const n = e[r], i = t.nextPart.get(n);
  if (i) {
    const c = Qt(e, r + 1, i);
    if (c) return c;
  }
  const a = t.validators;
  if (a === null)
    return;
  const s = r === 0 ? e.join(we) : e.slice(r).join(we), l = a.length;
  for (let c = 0; c < l; c++) {
    const d = a[c];
    if (d.validator(s))
      return d.classGroupId;
  }
}, on = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const r = e.slice(1, -1), t = r.indexOf(":"), o = r.slice(0, t);
  return o ? tn + o : void 0;
})(), nn = (e) => {
  const {
    theme: r,
    classGroups: t
  } = e;
  return an(t, r);
}, an = (e, r) => {
  const t = Zt();
  for (const o in e) {
    const n = e[o];
    Fe(n, t, o, r);
  }
  return t;
}, Fe = (e, r, t, o) => {
  const n = e.length;
  for (let i = 0; i < n; i++) {
    const a = e[i];
    sn(a, r, t, o);
  }
}, sn = (e, r, t, o) => {
  if (typeof e == "string") {
    ln(e, r, t);
    return;
  }
  if (typeof e == "function") {
    cn(e, r, t, o);
    return;
  }
  dn(e, r, t, o);
}, ln = (e, r, t) => {
  const o = e === "" ? r : Jt(r, e);
  o.classGroupId = t;
}, cn = (e, r, t, o) => {
  if (un(e)) {
    Fe(e(o), r, t, o);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(en(t, e));
}, dn = (e, r, t, o) => {
  const n = Object.entries(e), i = n.length;
  for (let a = 0; a < i; a++) {
    const [s, l] = n[a];
    Fe(l, Jt(r, s), t, o);
  }
}, Jt = (e, r) => {
  let t = e;
  const o = r.split(we), n = o.length;
  for (let i = 0; i < n; i++) {
    const a = o[i];
    let s = t.nextPart.get(a);
    s || (s = Zt(), t.nextPart.set(a, s)), t = s;
  }
  return t;
}, un = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, mn = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let r = 0, t = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null);
  const n = (i, a) => {
    t[i] = a, r++, r > e && (r = 0, o = t, t = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(i) {
      let a = t[i];
      if (a !== void 0)
        return a;
      if ((a = o[i]) !== void 0)
        return n(i, a), a;
    },
    set(i, a) {
      i in t ? t[i] = a : n(i, a);
    }
  };
}, ze = "!", st = ":", fn = [], lt = (e, r, t, o, n) => ({
  modifiers: e,
  hasImportantModifier: r,
  baseClassName: t,
  maybePostfixModifierPosition: o,
  isExternal: n
}), pn = (e) => {
  const {
    prefix: r,
    experimentalParseClassName: t
  } = e;
  let o = (n) => {
    const i = [];
    let a = 0, s = 0, l = 0, c;
    const d = n.length;
    for (let w = 0; w < d; w++) {
      const b = n[w];
      if (a === 0 && s === 0) {
        if (b === st) {
          i.push(n.slice(l, w)), l = w + 1;
          continue;
        }
        if (b === "/") {
          c = w;
          continue;
        }
      }
      b === "[" ? a++ : b === "]" ? a-- : b === "(" ? s++ : b === ")" && s--;
    }
    const f = i.length === 0 ? n : n.slice(l);
    let v = f, x = !1;
    f.endsWith(ze) ? (v = f.slice(0, -1), x = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      f.startsWith(ze) && (v = f.slice(1), x = !0)
    );
    const y = c && c > l ? c - l : void 0;
    return lt(i, x, v, y);
  };
  if (r) {
    const n = r + st, i = o;
    o = (a) => a.startsWith(n) ? i(a.slice(n.length)) : lt(fn, !1, a, void 0, !0);
  }
  if (t) {
    const n = o;
    o = (i) => t({
      className: i,
      parseClassName: n
    });
  }
  return o;
}, bn = (e) => {
  const r = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((t, o) => {
    r.set(t, 1e6 + o);
  }), (t) => {
    const o = [];
    let n = [];
    for (let i = 0; i < t.length; i++) {
      const a = t[i], s = a[0] === "[", l = r.has(a);
      s || l ? (n.length > 0 && (n.sort(), o.push(...n), n = []), o.push(a)) : n.push(a);
    }
    return n.length > 0 && (n.sort(), o.push(...n)), o;
  };
}, gn = (e) => ({
  cache: mn(e.cacheSize),
  parseClassName: pn(e),
  sortModifiers: bn(e),
  ...rn(e)
}), hn = /\s+/, vn = (e, r) => {
  const {
    parseClassName: t,
    getClassGroupId: o,
    getConflictingClassGroupIds: n,
    sortModifiers: i
  } = r, a = [], s = e.trim().split(hn);
  let l = "";
  for (let c = s.length - 1; c >= 0; c -= 1) {
    const d = s[c], {
      isExternal: f,
      modifiers: v,
      hasImportantModifier: x,
      baseClassName: y,
      maybePostfixModifierPosition: w
    } = t(d);
    if (f) {
      l = d + (l.length > 0 ? " " + l : l);
      continue;
    }
    let b = !!w, N = o(b ? y.substring(0, w) : y);
    if (!N) {
      if (!b) {
        l = d + (l.length > 0 ? " " + l : l);
        continue;
      }
      if (N = o(y), !N) {
        l = d + (l.length > 0 ? " " + l : l);
        continue;
      }
      b = !1;
    }
    const S = v.length === 0 ? "" : v.length === 1 ? v[0] : i(v).join(":"), R = x ? S + ze : S, I = R + N;
    if (a.indexOf(I) > -1)
      continue;
    a.push(I);
    const P = n(N, b);
    for (let C = 0; C < P.length; ++C) {
      const T = P[C];
      a.push(R + T);
    }
    l = d + (l.length > 0 ? " " + l : l);
  }
  return l;
}, xn = (...e) => {
  let r = 0, t, o, n = "";
  for (; r < e.length; )
    (t = e[r++]) && (o = er(t)) && (n && (n += " "), n += o);
  return n;
}, er = (e) => {
  if (typeof e == "string")
    return e;
  let r, t = "";
  for (let o = 0; o < e.length; o++)
    e[o] && (r = er(e[o])) && (t && (t += " "), t += r);
  return t;
}, yn = (e, ...r) => {
  let t, o, n, i;
  const a = (l) => {
    const c = r.reduce((d, f) => f(d), e());
    return t = gn(c), o = t.cache.get, n = t.cache.set, i = s, s(l);
  }, s = (l) => {
    const c = o(l);
    if (c)
      return c;
    const d = vn(l, t);
    return n(l, d), d;
  };
  return i = a, (...l) => i(xn(...l));
}, wn = [], O = (e) => {
  const r = (t) => t[e] || wn;
  return r.isThemeGetter = !0, r;
}, tr = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, rr = /^\((?:(\w[\w-]*):)?(.+)\)$/i, kn = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Cn = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Nn = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Rn = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, _n = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Sn = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, K = (e) => kn.test(e), _ = (e) => !!e && !Number.isNaN(Number(e)), H = (e) => !!e && Number.isInteger(Number(e)), Ee = (e) => e.endsWith("%") && _(e.slice(0, -1)), W = (e) => Cn.test(e), or = () => !0, In = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Nn.test(e) && !Rn.test(e)
), Le = () => !1, An = (e) => _n.test(e), En = (e) => Sn.test(e), Tn = (e) => !g(e) && !h(e), Pn = (e) => Z(e, ar, Le), g = (e) => tr.test(e), ee = (e) => Z(e, sr, In), ct = (e) => Z(e, Fn, _), zn = (e) => Z(e, cr, or), Mn = (e) => Z(e, lr, Le), dt = (e) => Z(e, nr, Le), On = (e) => Z(e, ir, En), he = (e) => Z(e, dr, An), h = (e) => rr.test(e), se = (e) => re(e, sr), Dn = (e) => re(e, lr), ut = (e) => re(e, nr), Vn = (e) => re(e, ar), Bn = (e) => re(e, ir), ve = (e) => re(e, dr, !0), $n = (e) => re(e, cr, !0), Z = (e, r, t) => {
  const o = tr.exec(e);
  return o ? o[1] ? r(o[1]) : t(o[2]) : !1;
}, re = (e, r, t = !1) => {
  const o = rr.exec(e);
  return o ? o[1] ? r(o[1]) : t : !1;
}, nr = (e) => e === "position" || e === "percentage", ir = (e) => e === "image" || e === "url", ar = (e) => e === "length" || e === "size" || e === "bg-size", sr = (e) => e === "length", Fn = (e) => e === "number", lr = (e) => e === "family-name", cr = (e) => e === "number" || e === "weight", dr = (e) => e === "shadow", Ln = () => {
  const e = O("color"), r = O("font"), t = O("text"), o = O("font-weight"), n = O("tracking"), i = O("leading"), a = O("breakpoint"), s = O("container"), l = O("spacing"), c = O("radius"), d = O("shadow"), f = O("inset-shadow"), v = O("text-shadow"), x = O("drop-shadow"), y = O("blur"), w = O("perspective"), b = O("aspect"), N = O("ease"), S = O("animate"), R = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], I = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], P = () => [...I(), h, g], C = () => ["auto", "hidden", "clip", "visible", "scroll"], T = () => ["auto", "contain", "none"], p = () => [h, g, l], A = () => [K, "full", "auto", ...p()], G = () => [H, "none", "subgrid", h, g], $ = () => ["auto", {
    span: ["full", H, h, g]
  }, H, h, g], j = () => [H, "auto", h, g], oe = () => ["auto", "min", "max", "fr", h, g], ne = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], q = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], M = () => ["auto", ...p()], Q = () => [K, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...p()], Re = () => [K, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...p()], _e = () => [K, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...p()], k = () => [e, h, g], Ue = () => [...I(), ut, dt, {
    position: [h, g]
  }], qe = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Ke = () => ["auto", "cover", "contain", Vn, Pn, {
    size: [h, g]
  }], Se = () => [Ee, se, ee], V = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    c,
    h,
    g
  ], B = () => ["", _, se, ee], me = () => ["solid", "dashed", "dotted", "double"], He = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], D = () => [_, Ee, ut, dt], Ye = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    y,
    h,
    g
  ], fe = () => ["none", _, h, g], pe = () => ["none", _, h, g], Ie = () => [_, h, g], be = () => [K, "full", ...p()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [W],
      breakpoint: [W],
      color: [or],
      container: [W],
      "drop-shadow": [W],
      ease: ["in", "out", "in-out"],
      font: [Tn],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [W],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [W],
      shadow: [W],
      spacing: ["px", _],
      text: [W],
      "text-shadow": [W],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", K, g, h, b]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [_, g, h, s]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": R()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": R()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: P()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: C()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": C()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": C()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: T()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": T()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": T()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: A()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": A()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": A()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": A(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: A()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": A(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: A()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": A()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": A()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: A()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: A()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: A()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: A()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [H, "auto", h, g]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [K, "full", "auto", s, ...p()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [_, K, "auto", "initial", "none", g]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", _, h, g]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", _, h, g]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [H, "first", "last", "none", h, g]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": G()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: $()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": j()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": j()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": G()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: $()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": j()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": j()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": oe()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": oe()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: p()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": p()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": p()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ne(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...q(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...q()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ne()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...q(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...q(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ne()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...q(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...q()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: p()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: p()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: p()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: p()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: p()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: p()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: p()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: p()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: p()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: p()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: p()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: M()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: M()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: M()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: M()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: M()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: M()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: M()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: M()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: M()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: M()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: M()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": p()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": p()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: Q()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/width
       */
      "inline-size": [{
        inline: ["auto", ...Re()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...Re()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-inline-size": [{
        "max-inline": ["none", ...Re()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/height
       */
      "block-size": [{
        block: ["auto", ..._e()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-block-size": [{
        "min-block": ["auto", ..._e()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-block-size": [{
        "max-block": ["none", ..._e()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [s, "screen", ...Q()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          s,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...Q()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          s,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [a]
          },
          ...Q()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...Q()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...Q()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...Q()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", t, se, ee]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [o, $n, zn]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Ee, g]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [Dn, Mn, r]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [g]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [n, h, g]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [_, "none", h, ct]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          i,
          ...p()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", h, g]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", h, g]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: k()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: k()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...me(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [_, "from-font", "auto", h, ee]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: k()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [_, "auto", h, g]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: p()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", h, g]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", h, g]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Ue()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: qe()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: Ke()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, H, h, g],
          radial: ["", h, g],
          conic: [H, h, g]
        }, Bn, On]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: k()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: Se()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: Se()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: Se()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: k()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: k()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: k()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: V()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": V()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": V()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": V()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": V()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": V()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": V()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": V()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": V()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": V()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": V()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": V()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": V()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": V()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": V()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: B()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": B()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": B()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": B()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": B()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": B()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": B()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": B()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": B()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": B()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": B()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": B()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": B()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...me(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...me(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: k()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": k()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": k()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": k()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": k()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": k()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": k()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": k()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": k()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": k()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": k()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: k()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...me(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [_, h, g]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", _, se, ee]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: k()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          d,
          ve,
          he
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: k()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", f, ve, he]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": k()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: B()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: k()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [_, ee]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": k()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": B()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": k()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", v, ve, he]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": k()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [_, h, g]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...He(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": He()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [_]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": D()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": D()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": k()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": k()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": D()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": D()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": k()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": k()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": D()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": D()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": k()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": k()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": D()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": D()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": k()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": k()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": D()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": D()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": k()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": k()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": D()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": D()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": k()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": k()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": D()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": D()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": k()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": k()
      }],
      "mask-image-radial": [{
        "mask-radial": [h, g]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": D()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": D()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": k()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": k()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": I()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [_]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": D()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": D()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": k()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": k()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Ue()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: qe()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: Ke()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", h, g]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          h,
          g
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: Ye()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [_, h, g]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [_, h, g]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          x,
          ve,
          he
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": k()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", _, h, g]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [_, h, g]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", _, h, g]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [_, h, g]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", _, h, g]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          h,
          g
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": Ye()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [_, h, g]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [_, h, g]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", _, h, g]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [_, h, g]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", _, h, g]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [_, h, g]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [_, h, g]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", _, h, g]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": p()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": p()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": p()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", h, g]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [_, "initial", h, g]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", N, h, g]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [_, h, g]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", S, h, g]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [w, h, g]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": P()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: fe()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": fe()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": fe()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": fe()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: pe()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": pe()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": pe()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": pe()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Ie()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Ie()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Ie()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [h, g, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: P()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: be()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": be()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": be()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": be()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: k()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: k()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", h, g]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": p()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": p()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": p()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": p()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": p()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": p()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": p()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": p()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": p()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": p()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": p()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": p()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": p()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": p()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": p()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": p()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": p()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": p()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": p()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": p()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": p()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": p()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", h, g]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...k()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [_, se, ee, ct]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...k()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, Gn = /* @__PURE__ */ yn(Ln);
function z(...e) {
  return Gn(ht(e));
}
const jn = Vr("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
      outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
      destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
      lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
      icon: "size-8",
      "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
      "icon-lg": "size-9"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
function ce({ className: e, variant: r = "default", size: t = "default", asChild: o = !1, ...n }) {
  return m(o ? Ko : "button", { "data-slot": "button", "data-variant": r, "data-size": t, className: z(jn({ variant: r, size: t, className: e })), ...n });
}
function Wn({ className: e, size: r = "default", ...t }) {
  return m("div", { "data-slot": "card", "data-size": r, className: z("group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl", e), ...t });
}
function Un({ className: e, ...r }) {
  return m("div", { "data-slot": "card-header", className: z("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3", e), ...r });
}
function qn({ className: e, ...r }) {
  return m("div", { "data-slot": "card-title", className: z("font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm", e), ...r });
}
function Kn({ className: e, ...r }) {
  return m("div", { "data-slot": "card-description", className: z("text-sm text-muted-foreground", e), ...r });
}
function Hn({ className: e, ...r }) {
  return m("div", { "data-slot": "card-content", className: z("px-4 group-data-[size=sm]/card:px-3", e), ...r });
}
function Yn({ className: e, ...r }) {
  return m(Ct, { "data-slot": "checkbox", className: z("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", e), ...r, children: m(Rt, { "data-slot": "checkbox-indicator", className: "grid place-content-center text-current transition-none [&>svg]:size-3.5", children: m(Er, {}) }) });
}
function Ge({ className: e, type: r, ...t }) {
  return m("input", { type: r, "data-slot": "input", className: z("h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40", e), ...t });
}
function Xn({ className: e, value: r, ...t }) {
  return m(Po, { "data-slot": "progress", className: z("relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted", e), ...t, children: m(zo, { "data-slot": "progress-indicator", className: "size-full flex-1 bg-primary transition-all", style: { transform: `translateX(-${100 - (r || 0)}%)` } }) });
}
function Zn({ className: e, ...r }) {
  return m(jo, { "data-slot": "radio-group", className: z("grid w-full gap-2", e), ...r });
}
function Qn({ className: e, ...r }) {
  return m(Wo, { "data-slot": "radio-group-item", className: z("group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", e), ...r, children: m(Uo, { "data-slot": "radio-group-indicator", className: "flex size-4 items-center justify-center", children: m("span", { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" }) }) });
}
const je = "__other__", xe = "__none__";
function ur(e) {
  return typeof e == "object" && e !== null && "value" in e ? {
    value: e.value,
    text: e.text
  } : {
    value: e,
    text: String(e)
  };
}
function Jn(e, r) {
  const t = Array.from(r).reduce((n, i, a) => n + i.charCodeAt(0) * (a + 1), 0), o = [...e];
  for (let n = o.length - 1; n > 0; n -= 1) {
    const i = (t + n * 17) % (n + 1);
    [o[n], o[i]] = [o[i], o[n]];
  }
  return o;
}
function mr(e) {
  const r = e.choices.map(ur), o = [..."choicesOrder" in e && e.choicesOrder === "random" ? Jn(r, `${e.name}:${e.title ?? ""}`) : r];
  return e.showNoneItem && o.push({ value: xe, text: "없음" }), e.showOtherItem && o.push({ value: je, text: "기타" }), o;
}
function ei(e, r, t, o) {
  const n = t.maskType === "date" ? "date" : t.inputType ?? "text";
  return {
    id: t.name,
    kind: "text",
    sourceType: t.type,
    name: t.name,
    title: t.title ?? t.name,
    description: t.description,
    isRequired: !!t.isRequired,
    visibleIf: t.visibleIf,
    pageTitle: r.title,
    pageDescription: r.description,
    panelTitle: o?.title,
    panelDescription: o?.description,
    formTitle: e.title,
    formDescription: e.description,
    inputType: n,
    min: t.min,
    max: t.max,
    defaultValue: t.defaultValue
  };
}
function ti(e, r, t, o) {
  return {
    id: t.name,
    kind: "radiogroup",
    sourceType: t.type,
    name: t.name,
    title: t.title ?? t.name,
    description: t.description,
    isRequired: !!t.isRequired,
    visibleIf: t.visibleIf,
    pageTitle: r.title,
    pageDescription: r.description,
    panelTitle: o?.title,
    panelDescription: o?.description,
    formTitle: e.title,
    formDescription: e.description,
    choices: mr(t),
    allowOther: !!t.showOtherItem,
    allowNone: !!t.showNoneItem,
    colCount: t.colCount,
    defaultValue: t.defaultValue
  };
}
function ri(e, r, t, o) {
  return {
    id: t.name,
    kind: "checkbox",
    sourceType: t.type,
    name: t.name,
    title: t.title ?? t.name,
    description: t.description,
    isRequired: !!t.isRequired,
    visibleIf: t.visibleIf,
    pageTitle: r.title,
    pageDescription: r.description,
    panelTitle: o?.title,
    panelDescription: o?.description,
    formTitle: e.title,
    formDescription: e.description,
    choices: mr(t),
    allowOther: !!t.showOtherItem,
    allowNone: !!t.showNoneItem,
    colCount: t.colCount,
    defaultValue: t.defaultValue
  };
}
function oi(e, r, t, o) {
  return {
    id: t.name,
    kind: "boolean",
    sourceType: t.type,
    name: t.name,
    title: t.title ?? t.name,
    description: t.description,
    isRequired: !!t.isRequired,
    visibleIf: t.visibleIf,
    pageTitle: r.title,
    pageDescription: r.description,
    panelTitle: o?.title,
    panelDescription: o?.description,
    formTitle: e.title,
    formDescription: e.description,
    choices: [
      { value: !0, text: "예" },
      { value: !1, text: "아니오" }
    ],
    defaultValue: t.defaultValue
  };
}
function ni(e, r, t, o) {
  const n = !!(t.isRequired || t.isAllRowRequired || t.eachRowRequired);
  return t.rows.map((i, a) => ({
    id: `${t.name}.${i.value}.${a}`,
    kind: "matrix-row",
    sourceType: t.type,
    name: `${t.name}.${i.value}`,
    matrixName: t.name,
    matrixTitle: t.title,
    matrixDescription: t.description,
    rowName: i.value,
    rowTitle: i.text,
    title: i.text,
    description: t.description,
    rowIndex: a,
    totalRows: t.rows.length,
    isRequired: n,
    visibleIf: t.visibleIf,
    pageTitle: r.title,
    pageDescription: r.description,
    panelTitle: o?.title ?? t.title,
    panelDescription: o?.description,
    formTitle: e.title,
    formDescription: e.description,
    columns: t.columns.map(ur),
    defaultValue: t.defaultValue?.[i.value]
  }));
}
function fr(e, r, t, o) {
  switch (t.type) {
    case "text":
      return [ei(e, r, t, o)];
    case "radiogroup":
      return [ti(e, r, t, o)];
    case "checkbox":
      return [ri(e, r, t, o)];
    case "boolean":
      return [oi(e, r, t, o)];
    case "matrix":
      return ni(e, r, t, o);
    case "panel":
      return t.elements.flatMap((n) => fr(e, r, n, t));
    default:
      return [];
  }
}
function ii(e) {
  return e.pages.flatMap((r) => r.elements.flatMap((t) => fr(e, r, t)));
}
function ai(e, r) {
  return e.split(".").reduce((t, o) => {
    if (t && typeof t == "object" && o in t)
      return t[o];
  }, r);
}
function si(e) {
  const r = e.trim();
  return r.startsWith("'") && r.endsWith("'") || r.startsWith('"') && r.endsWith('"') ? r.slice(1, -1) : r === "true" ? !0 : r === "false" ? !1 : Number.isNaN(Number(r)) ? r : Number(r);
}
function li(e, r) {
  if (!e)
    return !0;
  const t = e.match(/^\s*\{([^}]+)\}\s*(==|!=|>=|<=|>|<)\s*(.+?)\s*$/);
  if (!t)
    return !0;
  const [, o, n, i] = t, a = ai(o, r), s = si(i);
  switch (n) {
    case "==":
      return a === s;
    case "!=":
      return a !== s;
    case ">":
      return Number(a) > Number(s);
    case "<":
      return Number(a) < Number(s);
    case ">=":
      return Number(a) >= Number(s);
    case "<=":
      return Number(a) <= Number(s);
    default:
      return !0;
  }
}
function ci(e) {
  const r = e.replace(/\s+/g, "").length;
  return r >= 90 ? {
    container: "max-w-6xl",
    titleClass: "text-[clamp(1.3rem,0.96rem+1.2vw,2.05rem)] leading-[1.42] tracking-[-0.04em]",
    asideClass: "mt-3 text-[clamp(1.02rem,0.9rem+0.45vw,1.25rem)] leading-[1.75] tracking-[-0.025em]"
  } : r >= 60 ? {
    container: "max-w-5xl",
    titleClass: "text-[clamp(1.42rem,1.02rem+1.45vw,2.45rem)] leading-[1.34] tracking-[-0.045em]",
    asideClass: "mt-3 text-[clamp(1.05rem,0.94rem+0.38vw,1.28rem)] leading-[1.72] tracking-[-0.025em]"
  } : {
    container: "max-w-5xl",
    titleClass: "text-[clamp(1.55rem,1.1rem+1.85vw,3rem)] leading-[1.24] tracking-[-0.05em]",
    asideClass: "mt-3 text-[clamp(1.05rem,0.94rem+0.38vw,1.28rem)] leading-[1.72] tracking-[-0.025em]"
  };
}
function di(e) {
  const r = e.match(/^(.*?)(\s*[\(\[].*[\)\]])$/);
  if (!r)
    return {
      main: e,
      aside: null
    };
  const [, t, o] = r;
  return o.length < 12 ? {
    main: e,
    aside: null
  } : {
    main: t.trim(),
    aside: o.trim()
  };
}
function mt(e) {
  return e.reduce((r, t) => {
    if (t.defaultValue === void 0)
      return r;
    if (t.kind === "matrix-row") {
      const o = r[t.matrixName] ?? {};
      return r[t.matrixName] = {
        ...o,
        [t.rowName]: t.defaultValue
      }, r;
    }
    return r[t.name] = t.defaultValue, r;
  }, {});
}
function te(e, r) {
  return e.kind === "matrix-row" ? r[e.matrixName]?.[e.rowName] : r[e.name];
}
function We(e, r, t) {
  if (e.kind === "matrix-row") {
    const o = r[e.matrixName] ?? {};
    return {
      ...r,
      [e.matrixName]: {
        ...o,
        [e.rowName]: t
      }
    };
  }
  return {
    ...r,
    [e.name]: t
  };
}
function ui(e, r) {
  if (e.kind === "matrix-row") {
    const n = { ...r[e.matrixName] ?? {} };
    return delete n[e.rowName], {
      ...r,
      [e.matrixName]: n
    };
  }
  const t = { ...r };
  return delete t[e.name], delete t[`${e.name}__other`], t;
}
function pr(e, r) {
  return Array.isArray(e) ? e.includes(r) : e === r;
}
function mi(e, r) {
  const t = te(e, r);
  return e.kind === "checkbox" ? Array.isArray(t) && t.length > 0 : e.kind === "text" ? typeof t == "string" || typeof t == "number" : t != null && t !== "";
}
function fi(e, r) {
  if (!e.isRequired)
    return !0;
  const t = te(e, r);
  if (e.kind === "checkbox")
    return Array.isArray(t) && t.length > 0;
  if (e.kind === "text") {
    if (e.inputType === "number") {
      const o = Number(t);
      return !(Number.isNaN(o) || e.min !== void 0 && o < e.min || e.max !== void 0 && o > e.max);
    }
    return typeof t == "string" && t.trim().length > 0;
  }
  return t != null && t !== "";
}
function br({ cols: e = 1, children: r }) {
  return m("div", { className: z("mx-auto grid w-full gap-3", e === 1 ? "max-w-[80%]" : "max-w-[92%]", e >= 2 ? "md:grid-cols-2" : "grid-cols-1", e >= 3 ? "xl:grid-cols-3" : ""), children: r });
}
function pi(e, r, t) {
  const o = te(e, r), n = e.kind === "radiogroup" ? `${e.name}__other` : void 0, i = e.kind === "radiogroup" ? e.colCount ?? 1 : 1, a = e.kind === "matrix-row" ? e.columns : e.choices;
  return E("div", { className: "flex flex-col gap-4", children: [m(Zn, { value: o === void 0 ? "" : String(o), onValueChange: (s) => {
    const l = a.find((c) => String(c.value) === s)?.value;
    t((c) => We(e, c, l));
  }, className: "gap-3", children: m(br, { cols: i, children: a.map((s) => {
    const l = pr(o, s.value);
    return E("label", { className: z("option-card flex min-h-20 cursor-pointer items-start gap-4 rounded-3xl border px-4 py-4 transition-all", l ? "border-primary bg-primary/8 shadow-[0_22px_50px_-32px_rgba(19,72,70,0.65)]" : "border-border/80 bg-white/70 hover:border-primary/25 hover:bg-white"), children: [m(Qn, { value: String(s.value), className: "mt-1 size-5" }), m("span", { className: "text-[clamp(0.98rem,0.88rem+0.28vw,1.08rem)] leading-[1.75]", children: s.text })] }, String(s.value));
  }) }) }), e.kind === "radiogroup" && o === je && n !== void 0 ? m(Ge, { value: String(r[n] ?? ""), onChange: (s) => t((l) => ({
    ...l,
    [n]: s.target.value
  })), placeholder: "기타 내용을 입력해주세요", className: "h-12 rounded-2xl bg-white/80 px-4 text-sm" }) : null] });
}
function bi(e, r, t) {
  const o = Array.isArray(te(e, r)) ? te(e, r) : [], n = `${e.name}__other`;
  return E("div", { className: "flex flex-col gap-4", children: [m(br, { cols: e.colCount ?? 1, children: e.choices.map((i) => {
    const a = o.includes(i.value);
    return E("label", { className: z("option-card flex min-h-20 cursor-pointer items-start gap-4 rounded-3xl border px-4 py-4 transition-all", a ? "border-primary bg-primary/8 shadow-[0_22px_50px_-32px_rgba(19,72,70,0.65)]" : "border-border/80 bg-white/70 hover:border-primary/25 hover:bg-white"), children: [m(Yn, { checked: a, onCheckedChange: (s) => {
      t((l) => {
        const c = Array.isArray(l[e.name]) ? [...l[e.name]] : [];
        let d = c;
        return i.value === xe && s ? d = [xe] : s ? d = c.filter((f) => f !== xe).concat(i.value) : d = c.filter((f) => f !== i.value), {
          ...l,
          [e.name]: d
        };
      });
    }, className: "mt-1 size-5" }), m("span", { className: "text-[clamp(1.04rem,0.9rem+0.5vw,1.24rem)] leading-[1.8] tracking-[-0.015em]", children: i.text })] }, String(i.value));
  }) }), o.includes(je) ? m(Ge, { value: String(r[n] ?? ""), onChange: (i) => t((a) => ({
    ...a,
    [n]: i.target.value
  })), placeholder: "기타 내용을 입력해주세요", className: "h-12 rounded-2xl bg-white/80 px-4 text-sm" }) : null] });
}
function gi(e, r, t) {
  const o = te(e, r);
  return m("div", { className: "mx-auto w-full max-w-[80%] rounded-[30px] border border-slate-300/75 bg-white p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]", children: m(Ge, { type: e.inputType, min: e.min, max: e.max, value: o === void 0 ? "" : String(o), onChange: (n) => {
    const i = n.target.value, a = e.inputType === "number" ? i === "" ? "" : Number(i) : i;
    t((s) => We(e, s, a));
  }, placeholder: "응답을 입력해주세요", className: "h-16 rounded-[22px] border-slate-300 bg-slate-50 px-5 !text-[clamp(1.1rem,0.96rem+0.46vw,1.35rem)] leading-[1.35] shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] placeholder:text-[clamp(1rem,0.92rem+0.22vw,1.12rem)] md:!text-[clamp(1.1rem,0.96rem+0.46vw,1.35rem)] focus-visible:border-primary focus-visible:bg-white" }) });
}
function hi(e, r) {
  const t = e[r];
  if (!t || t.kind !== "matrix-row")
    return null;
  let o = r;
  for (; o > 0; ) {
    const i = e[o - 1];
    if (!i || i.kind !== "matrix-row" || i.matrixName !== t.matrixName)
      break;
    o -= 1;
  }
  let n = r;
  for (; n < e.length - 1; ) {
    const i = e[n + 1];
    if (!i || i.kind !== "matrix-row" || i.matrixName !== t.matrixName)
      break;
    n += 1;
  }
  return { start: o, end: n };
}
function vi({ step: e, groupSteps: r, groupStartIndex: t, answers: o, setAnswers: n, currentIndex: i, onFocusRow: a, onAdvance: s }) {
  const l = e.columns.length <= 2, c = i - t, d = ae(null), f = ae(null), v = ae([]), x = ae(0), y = ae(null), w = r[c] ?? e, b = c > 0, N = c < r.length - 1;
  le(() => () => {
    y.current !== null && window.clearTimeout(y.current);
  }, []);
  const S = Qe((C) => {
    const T = Math.min(Math.max(c + C, 0), r.length - 1);
    T !== c && a(t + T);
  }), R = Qe((C) => {
    x.current += C, !(Math.abs(x.current) < 30) && (S(x.current > 0 ? 1 : -1), x.current = 0);
  });
  le(() => {
    const C = d.current;
    if (!C)
      return;
    const T = (p) => {
      p.preventDefault(), R(p.deltaY);
    };
    return C.addEventListener("wheel", T, { passive: !1 }), () => C.removeEventListener("wheel", T);
  }, [R]), le(() => {
    const C = f.current, T = v.current[c];
    if (!C || !T)
      return;
    const A = T.offsetTop + T.offsetHeight / 2 - C.clientHeight / 2;
    C.scrollTo({
      top: Math.max(A, 0),
      behavior: "smooth"
    });
  }, [c]);
  function I(C) {
    C.preventDefault(), R(C.deltaY);
  }
  function P(C) {
    y.current !== null && window.clearTimeout(y.current), y.current = window.setTimeout(() => {
      if (C < r.length - 1) {
        a(t + C + 1);
        return;
      }
      s();
    }, 180);
  }
  return E("div", { className: "mx-auto flex w-full max-w-6xl flex-col gap-5", children: [E("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/65 bg-white/68 px-5 py-4 shadow-[0_30px_70px_-52px_rgba(19,37,36,0.65)]", children: [E("div", { children: [m("p", { className: "text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase", children: "Matrix View" }), E("p", { className: "mt-1 text-sm text-muted-foreground", children: [w.rowIndex + 1, " / ", r.length, " rows"] })] }), E("div", { className: "flex items-center gap-2", children: [m(ce, { type: "button", variant: "outline", size: "icon-lg", className: "rounded-full bg-white/75", onClick: () => S(-1), disabled: c === 0, "aria-label": "Previous row", children: m(Ir, {}) }), m(ce, { type: "button", variant: "outline", size: "icon-lg", className: "rounded-full bg-white/75", onClick: () => S(1), disabled: c === r.length - 1, "aria-label": "Next row", children: m(kr, {}) })] })] }), E("div", { ref: d, onWheel: I, className: "matrix-carousel relative overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,rgba(247,251,250,0.96),rgba(236,243,242,0.92))] p-4 md:p-6", children: [b ? m("div", { className: "matrix-carousel__veil matrix-carousel__veil--top" }) : null, N ? m("div", { className: "matrix-carousel__veil matrix-carousel__veil--bottom" }) : null, m("div", { className: "overflow-x-auto", children: m("div", { className: "min-w-[680px] w-full md:min-w-0", style: {
    "--matrix-column-count": String(e.columns.length),
    "--matrix-choice-gap": l ? "1.5rem" : "0.75rem"
  }, children: m("div", { ref: f, className: "matrix-carousel__viewport overflow-y-auto px-2", children: m("div", { className: "flex flex-col gap-3 py-[14vh]", children: r.map((C, T) => {
    const p = T - c, A = p === 0 ? "active" : Math.abs(p) === 1 ? "near" : "far", G = te(C, o);
    return E("div", { ref: ($) => {
      v.current[T] = $;
    }, "data-row-state": A, className: z("matrix-carousel__row grid items-center gap-4 rounded-[28px] border border-white/60 px-4 py-4 transition-[transform,opacity,filter,background-color,box-shadow] duration-300", A === "active" ? "bg-white/92 shadow-[0_28px_75px_-52px_rgba(19,72,70,0.8)]" : "bg-white/55"), style: {
      gridTemplateColumns: l ? "minmax(0, 36%) minmax(0, 64%)" : "minmax(0, 40%) minmax(0, 60%)"
    }, onClick: () => a(t + T), children: [m("div", { className: "flex min-h-24 items-center rounded-[22px] border border-transparent px-4 py-4 text-left", children: E("div", { children: [E("div", { className: "text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase", children: ["Row ", T + 1] }), m("p", { className: "mt-2 break-keep text-[clamp(0.98rem,0.92rem+0.22vw,1.12rem)] leading-7 text-foreground", children: C.rowTitle })] }) }), m("div", { className: z("grid min-w-0 gap-3", l ? "justify-center" : ""), style: {
      gap: "var(--matrix-choice-gap)",
      gridTemplateColumns: l ? `repeat(${C.columns.length}, minmax(10.5rem, 12.5rem))` : `repeat(${C.columns.length}, minmax(0, 1fr))`
    }, children: C.columns.map(($) => {
      const j = pr(G, $.value);
      return E("button", { type: "button", className: z("matrix-carousel__cell flex h-20 min-w-0 self-center items-center justify-center rounded-[22px] border px-2 py-3 text-center text-sm font-semibold transition-all", j ? "border-primary bg-primary text-primary-foreground shadow-[0_24px_45px_-30px_rgba(19,72,70,0.85)]" : "border-border/80 bg-white/86 text-foreground hover:border-primary/35 hover:bg-primary/6"), onClick: (oe) => {
        oe.stopPropagation(), n((ne) => We(C, ne, $.value)), P(T);
      }, "aria-pressed": j, children: [m("span", { className: "sr-only", children: C.rowTitle }), m("span", { className: "matrix-carousel__cell-shell", children: m("span", { className: "matrix-carousel__cell-label", children: $.text }) })] }, String($.value));
    }) })] }, C.id);
  }) }) }) }) })] }), m("p", { className: "text-center text-sm text-muted-foreground", children: "마우스 휠 또는 위아래 버튼으로 행을 이동할 수 있고, 응답하면 자동으로 다음 행으로 내려갑니다." })] });
}
function ki({ questionnaire: e, formId: r, onComplete: t, initialAnswers: u }) {
  const o = Xe(() => ii(e), [e]), l = Xe(() => ({
    ...mt(o),
    ...u
  }), [o, u]), [n, i] = Ze(() => l), [a, s] = Ze(0);
  le(() => {
    i(l), s(0);
  }, [l, r]);
  const c = (A) => {
    i((G) => A(G));
  }, d = Xe(() => o.filter((A) => li(A.visibleIf, n)), [n, o]);
  le(() => {
    d.length !== 0 && a >= d.length && s(d.length - 1);
  }, [a, d.length]);
  const f = d[a], v = d.length === 0 ? 0 : (a + 1) / d.length * 100;
  if (!f)
    return null;
  const x = f.kind === "matrix-row" ? f.rowTitle : f.title, y = ci(x), w = di(x), b = a > 0, N = fi(f, n), S = a === d.length - 1, R = d.filter((A) => mi(A, n)).length, I = f.kind === "matrix-row" ? hi(d, a) : null, P = I === null ? [] : d.slice(I.start, I.end + 1), C = I === null ? 0 : a - I.start, T = f.kind === "matrix-row" ? C + 1 : a + 1, U = f.kind === "matrix-row" ? P.length : d.length;
  function M() {
    if (N) {
      if (S) {
        t?.({
          answers: n,
          completedSteps: R,
          totalSteps: d.length
        });
        return;
      }
      s((A) => Math.min(A + 1, d.length - 1));
    }
  }
  return E(Wn, { className: "questionnaire-js glass-panel overflow-visible rounded-[32px] border-white/60 bg-white/68 py-0 shadow-[0_40px_120px_-58px_rgba(20,42,41,0.55)] backdrop-blur-xl", children: [m(Un, { className: "gap-4 border-b border-white/60 px-6 py-5 md:px-8 md:py-6", children: E("div", { className: "flex flex-col gap-4", children: [E("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [E("div", { className: "flex flex-wrap items-center gap-3", children: [m("p", { className: "text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase", children: f.kind === "matrix-row" ? f.matrixTitle ?? f.panelTitle ?? f.formTitle ?? e.title ?? e.pages[0]?.title ?? "Questionnaire" : f.formTitle ?? e.title ?? e.pages[0]?.title ?? "Questionnaire" }), E("div", { className: "rounded-full border border-white/70 bg-white/75 px-3 py-2 text-sm text-muted-foreground shadow-sm", children: [T, " / ", U] })] }), E(ce, { type: "button", variant: "ghost", size: "lg", onClick: () => c((A) => ui(f, A)), className: "h-11 rounded-full bg-white/75 px-4 hover:bg-white", children: [m(Mr, { "data-icon": "inline-start" }), "Clear"] })] }), m(Kn, { className: "max-w-5xl break-keep text-sm leading-7 text-muted-foreground md:text-base", children: (f.kind === "matrix-row" ? f.matrixDescription : void 0) ?? f.description ?? f.panelTitle ?? f.pageDescription ?? f.formDescription }), m(Xn, { value: v, className: "h-2 rounded-full bg-black/8" }), E("div", { className: "flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground", children: [E("div", { className: "inline-flex items-center gap-2", children: [m(Dr, { className: "size-4" }), E("span", { children: [R, " answered"] })] }), m("span", { children: f.kind === "matrix-row" ? f.pageTitle ?? f.formTitle : f.panelTitle ?? f.pageTitle ?? f.formTitle })] })] }) }), E(Hn, { className: "px-6 py-7 md:px-8 md:py-8", children: [f.kind === "matrix-row" ? m(vi, { step: f, groupSteps: P, groupStartIndex: I?.start ?? a, answers: n, setAnswers: c, currentIndex: a, onFocusRow: s, onAdvance: M }) : E(ft, { children: [E("div", { className: z("mx-auto mb-8 flex flex-col items-center text-center", y.container), children: [m(qn, { className: z("break-keep font-semibold text-balance", y.titleClass), children: w.main }), w.aside ? m("p", { className: z("max-w-4xl break-keep text-muted-foreground text-balance", y.asideClass), children: w.aside }) : null] }), f.kind === "text" ? gi(f, n, c) : f.kind === "checkbox" ? bi(f, n, c) : pi(f, n, c)] }), E("div", { className: "mt-8 flex flex-col gap-3 border-t border-white/60 pt-6 sm:flex-row sm:items-center sm:justify-between", children: [E(ce, { type: "button", variant: "outline", size: "lg", disabled: !b, onClick: () => s((A) => Math.max(A - 1, 0)), className: "h-12 rounded-full bg-white/72 px-5", children: [m(Nr, { "data-icon": "inline-start" }), "Previous"] }), E("div", { className: "flex items-center gap-3", children: [f.isRequired && !N ? m("p", { className: "text-sm text-destructive", children: "필수 질문입니다. 응답 후 다음으로 진행할 수 있습니다." }) : null, E(ce, { type: "button", size: "lg", disabled: !N, onClick: M, className: "h-12 rounded-full px-6 shadow-[0_24px_55px_-28px_rgba(19,72,70,0.75)]", children: [m(Pr, { "data-icon": "inline-start" }), S ? "Complete" : "Continue", S ? null : m(_r, { "data-icon": "inline-end" })] })] })] })] })] });
}
export {
  ki as QuestionnaireFlow
};
