import { jsx as m, jsxs as A, Fragment as ft } from "react/jsx-runtime";
import * as u from "react";
import te, { forwardRef as pt, createElement as Te, useMemo as Ze, useState as Pe, useEffect as oe, useRef as ae, useCallback as Qe } from "react";
import "react-dom";
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
  }, c) => Te(
    "svg",
    {
      ref: c,
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
      ...a.map(([l, d]) => Te(l, d)),
      ...Array.isArray(i) ? i : [i]
    ]
  )
);
const Z = (e, r) => {
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
], kr = Z("arrow-down", wr);
const Cr = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
], Nr = Z("arrow-left", Cr);
const Rr = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
], _r = Z("arrow-right", Rr);
const Sr = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
], Ir = Z("arrow-up", Sr);
const Ar = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]], Er = Z("check", Ar);
const Tr = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }]
], Pr = Z("circle-dot", Tr);
const Mr = [
  [
    "path",
    {
      d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
      key: "g5wo59"
    }
  ],
  ["path", { d: "m5.082 11.09 8.828 8.828", key: "1wx5vj" }]
], zr = Z("eraser", Mr);
const Or = [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }]
], Vr = Z("list-checks", Or);
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
const et = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, tt = ht, $r = (e, r) => (t) => {
  var o;
  if (r?.variants == null) return tt(e, t?.class, t?.className);
  const { variants: n, defaultVariants: i } = r, a = Object.keys(n).map((l) => {
    const d = t?.[l], p = i?.[l];
    if (d === null) return null;
    const v = et(d) || et(p);
    return n[l][v];
  }), s = t && Object.entries(t).reduce((l, d) => {
    let [p, v] = d;
    return v === void 0 || (l[p] = v), l;
  }, {}), c = r == null || (o = r.compoundVariants) === null || o === void 0 ? void 0 : o.reduce((l, d) => {
    let { class: p, className: v, ...x } = d;
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
      ...l,
      p,
      v
    ] : l;
  }, []);
  return tt(e, a, c, t?.class, t?.className);
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
function H(...e) {
  return u.useCallback(ke(...e), e);
}
// @__NO_SIDE_EFFECTS__
function Dr(e) {
  const r = /* @__PURE__ */ Fr(e), t = u.forwardRef((o, n) => {
    const { children: i, ...a } = o, s = u.Children.toArray(i), c = s.find(Gr);
    if (c) {
      const l = c.props.children, d = s.map((p) => p === c ? u.Children.count(l) > 1 ? u.Children.only(null) : u.isValidElement(l) ? l.props.children : null : p);
      return /* @__PURE__ */ m(r, { ...a, ref: n, children: u.isValidElement(l) ? u.cloneElement(l, void 0, d) : null });
    }
    return /* @__PURE__ */ m(r, { ...a, ref: n, children: i });
  });
  return t.displayName = `${e}.Slot`, t;
}
// @__NO_SIDE_EFFECTS__
function Fr(e) {
  const r = u.forwardRef((t, o) => {
    const { children: n, ...i } = t;
    if (u.isValidElement(n)) {
      const a = Br(n), s = jr(i, n.props);
      return n.type !== u.Fragment && (s.ref = o ? ke(o, a) : a), u.cloneElement(n, s);
    }
    return u.Children.count(n) > 1 ? u.Children.only(null) : null;
  });
  return r.displayName = `${e}.SlotClone`, r;
}
var Lr = /* @__PURE__ */ Symbol("radix.slottable");
function Gr(e) {
  return u.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Lr;
}
function jr(e, r) {
  const t = { ...r };
  for (const o in r) {
    const n = e[o], i = r[o];
    /^on[A-Z]/.test(o) ? n && i ? t[o] = (...s) => {
      const c = i(...s);
      return n(...s), c;
    } : n && (t[o] = n) : o === "style" ? t[o] = { ...n, ...i } : o === "className" && (t[o] = [n, i].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
function Br(e) {
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
], W = Wr.reduce((e, r) => {
  const t = /* @__PURE__ */ Dr(`Primitive.${r}`), o = u.forwardRef((n, i) => {
    const { asChild: a, ...s } = n, c = a ? t : r;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ m(c, { ...s, ref: i });
  });
  return o.displayName = `Primitive.${r}`, { ...e, [r]: o };
}, {});
function se(e, r = []) {
  let t = [];
  function o(i, a) {
    const s = u.createContext(a), c = t.length;
    t = [...t, a];
    const l = (p) => {
      const { scope: v, children: x, ...y } = p, w = v?.[e]?.[c] || s, b = u.useMemo(() => y, Object.values(y));
      return /* @__PURE__ */ m(w.Provider, { value: b, children: x });
    };
    l.displayName = i + "Provider";
    function d(p, v) {
      const x = v?.[e]?.[c] || s, y = u.useContext(x);
      if (y) return y;
      if (a !== void 0) return a;
      throw new Error(`\`${p}\` must be used within \`${i}\``);
    }
    return [l, d];
  }
  const n = () => {
    const i = t.map((a) => u.createContext(a));
    return function(s) {
      const c = s?.[e] || i;
      return u.useMemo(
        () => ({ [`__scope${e}`]: { ...s, [e]: c } }),
        [s, c]
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
      const a = o.reduce((s, { useScope: c, scopeName: l }) => {
        const p = c(i)[`__scope${l}`];
        return { ...s, ...p };
      }, {});
      return u.useMemo(() => ({ [`__scope${r.scopeName}`]: a }), [a]);
    };
  };
  return t.scopeName = r.scopeName, t;
}
// @__NO_SIDE_EFFECTS__
function ot(e) {
  const r = /* @__PURE__ */ qr(e), t = u.forwardRef((o, n) => {
    const { children: i, ...a } = o, s = u.Children.toArray(i), c = s.find(Kr);
    if (c) {
      const l = c.props.children, d = s.map((p) => p === c ? u.Children.count(l) > 1 ? u.Children.only(null) : u.isValidElement(l) ? l.props.children : null : p);
      return /* @__PURE__ */ m(r, { ...a, ref: n, children: u.isValidElement(l) ? u.cloneElement(l, void 0, d) : null });
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
var Hr = /* @__PURE__ */ Symbol("radix.slottable");
function Kr(e) {
  return u.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === Hr;
}
function Yr(e, r) {
  const t = { ...r };
  for (const o in r) {
    const n = e[o], i = r[o];
    /^on[A-Z]/.test(o) ? n && i ? t[o] = (...s) => {
      const c = i(...s);
      return n(...s), c;
    } : n && (t[o] = n) : o === "style" ? t[o] = { ...n, ...i } : o === "className" && (t[o] = [n, i].filter(Boolean).join(" "));
  }
  return { ...e, ...t };
}
function Xr(e) {
  let r = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning;
  return t ? e.ref : (r = Object.getOwnPropertyDescriptor(e, "ref")?.get, t = r && "isReactWarning" in r && r.isReactWarning, t ? e.props.ref : e.props.ref || e.ref);
}
function Zr(e) {
  const r = e + "CollectionProvider", [t, o] = se(r), [n, i] = t(
    r,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), a = (w) => {
    const { scope: b, children: N } = w, S = te.useRef(null), R = te.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ m(n, { scope: b, itemMap: R, collectionRef: S, children: N });
  };
  a.displayName = r;
  const s = e + "CollectionSlot", c = /* @__PURE__ */ ot(s), l = te.forwardRef(
    (w, b) => {
      const { scope: N, children: S } = w, R = i(s, N), I = H(b, R.collectionRef);
      return /* @__PURE__ */ m(c, { ref: I, children: S });
    }
  );
  l.displayName = s;
  const d = e + "CollectionItemSlot", p = "data-radix-collection-item", v = /* @__PURE__ */ ot(d), x = te.forwardRef(
    (w, b) => {
      const { scope: N, children: S, ...R } = w, I = te.useRef(null), T = H(b, I), P = i(d, N);
      return te.useEffect(() => (P.itemMap.set(I, { ref: I, ...R }), () => {
        P.itemMap.delete(I);
      })), /* @__PURE__ */ m(v, { [p]: "", ref: T, children: S });
    }
  );
  x.displayName = d;
  function y(w) {
    const b = i(e + "CollectionConsumer", w);
    return te.useCallback(() => {
      const S = b.collectionRef.current;
      if (!S) return [];
      const R = Array.from(S.querySelectorAll(`[${p}]`));
      return Array.from(b.itemMap.values()).sort(
        (P, $) => R.indexOf(P.ref.current) - R.indexOf($.ref.current)
      );
    }, [b.collectionRef, b.itemMap]);
  }
  return [
    { Provider: a, Slot: l, ItemSlot: x },
    y,
    o
  ];
}
function B(e, r, { checkForDefaultPrevented: t = !0 } = {}) {
  return function(n) {
    if (e?.(n), t === !1 || !n.defaultPrevented)
      return r?.(n);
  };
}
var de = globalThis?.document ? u.useLayoutEffect : () => {
}, Qr = u[" useInsertionEffect ".trim().toString()] || de;
function Oe({
  prop: e,
  defaultProp: r,
  onChange: t = () => {
  },
  caller: o
}) {
  const [n, i, a] = Jr({
    defaultProp: r,
    onChange: t
  }), s = e !== void 0, c = s ? e : n;
  {
    const d = u.useRef(e !== void 0);
    u.useEffect(() => {
      const p = d.current;
      p !== s && console.warn(
        `${o} is changing from ${p ? "controlled" : "uncontrolled"} to ${s ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
      ), d.current = s;
    }, [s, o]);
  }
  const l = u.useCallback(
    (d) => {
      if (s) {
        const p = eo(d) ? d(e) : d;
        p !== e && a.current?.(p);
      } else
        i(d);
    },
    [s, e, i, a]
  );
  return [c, l];
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
var Ve = (e) => {
  const { present: r, children: t } = e, o = ro(r), n = typeof t == "function" ? t({ present: o.isPresent }) : u.Children.only(t), i = H(o.ref, oo(n));
  return typeof t == "function" || o.isPresent ? u.cloneElement(n, { ref: i }) : null;
};
Ve.displayName = "Presence";
function ro(e) {
  const [r, t] = u.useState(), o = u.useRef(null), n = u.useRef(e), i = u.useRef("none"), a = e ? "mounted" : "unmounted", [s, c] = to(a, {
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
    const l = ge(o.current);
    i.current = s === "mounted" ? l : "none";
  }, [s]), de(() => {
    const l = o.current, d = n.current;
    if (d !== e) {
      const v = i.current, x = ge(l);
      e ? c("MOUNT") : x === "none" || l?.display === "none" ? c("UNMOUNT") : c(d && v !== x ? "ANIMATION_OUT" : "UNMOUNT"), n.current = e;
    }
  }, [e, c]), de(() => {
    if (r) {
      let l;
      const d = r.ownerDocument.defaultView ?? window, p = (x) => {
        const w = ge(o.current).includes(CSS.escape(x.animationName));
        if (x.target === r && w && (c("ANIMATION_END"), !n.current)) {
          const b = r.style.animationFillMode;
          r.style.animationFillMode = "forwards", l = d.setTimeout(() => {
            r.style.animationFillMode === "forwards" && (r.style.animationFillMode = b);
          });
        }
      }, v = (x) => {
        x.target === r && (i.current = ge(o.current));
      };
      return r.addEventListener("animationstart", v), r.addEventListener("animationcancel", p), r.addEventListener("animationend", p), () => {
        d.clearTimeout(l), r.removeEventListener("animationstart", v), r.removeEventListener("animationcancel", p), r.removeEventListener("animationend", p);
      };
    } else
      c("ANIMATION_END");
  }, [r, c]), {
    isPresent: ["mounted", "unmountSuspended"].includes(s),
    ref: u.useCallback((l) => {
      o.current = l ? getComputedStyle(l) : null, t(l);
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
          const c = i.borderBoxSize, l = Array.isArray(c) ? c[0] : c;
          a = l.inlineSize, s = l.blockSize;
        } else
          a = e.offsetWidth, s = e.offsetHeight;
        t({ width: a, height: s });
      });
      return o.observe(e, { box: "border-box" }), () => o.unobserve(e);
    } else
      t(void 0);
  }, [e]), r;
}
var Ce = "Checkbox", [co] = se(Ce), [uo, $e] = co(Ce);
function mo(e) {
  const {
    __scopeCheckbox: r,
    checked: t,
    children: o,
    defaultChecked: n,
    disabled: i,
    form: a,
    name: s,
    onCheckedChange: c,
    required: l,
    value: d = "on",
    // @ts-expect-error
    internal_do_not_use_render: p
  } = e, [v, x] = Oe({
    prop: t,
    defaultProp: n ?? !1,
    onChange: c,
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
    required: l,
    defaultChecked: X(n) ? !1 : n,
    isFormControl: R,
    bubbleInput: b,
    setBubbleInput: N
  };
  return /* @__PURE__ */ m(
    uo,
    {
      scope: r,
      ...I,
      children: fo(p) ? p(I) : o
    }
  );
}
var wt = "CheckboxTrigger", kt = u.forwardRef(
  ({ __scopeCheckbox: e, onKeyDown: r, onClick: t, ...o }, n) => {
    const {
      control: i,
      value: a,
      disabled: s,
      checked: c,
      required: l,
      setControl: d,
      setChecked: p,
      hasConsumerStoppedPropagationRef: v,
      isFormControl: x,
      bubbleInput: y
    } = $e(wt, e), w = H(n, d), b = u.useRef(c);
    return u.useEffect(() => {
      const N = i?.form;
      if (N) {
        const S = () => p(b.current);
        return N.addEventListener("reset", S), () => N.removeEventListener("reset", S);
      }
    }, [i, p]), /* @__PURE__ */ m(
      W.button,
      {
        type: "button",
        role: "checkbox",
        "aria-checked": X(c) ? "mixed" : c,
        "aria-required": l,
        "data-state": It(c),
        "data-disabled": s ? "" : void 0,
        disabled: s,
        value: a,
        ...o,
        ref: w,
        onKeyDown: B(r, (N) => {
          N.key === "Enter" && N.preventDefault();
        }),
        onClick: B(t, (N) => {
          p((S) => X(S) ? !0 : !S), y && x && (v.current = N.isPropagationStopped(), v.current || N.stopPropagation());
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
      value: c,
      onCheckedChange: l,
      form: d,
      ...p
    } = e;
    return /* @__PURE__ */ m(
      mo,
      {
        __scopeCheckbox: t,
        checked: n,
        defaultChecked: i,
        disabled: s,
        required: a,
        onCheckedChange: l,
        name: o,
        form: d,
        value: c,
        internal_do_not_use_render: ({ isFormControl: v }) => /* @__PURE__ */ A(ft, { children: [
          /* @__PURE__ */ m(
            kt,
            {
              ...p,
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
    const { __scopeCheckbox: t, forceMount: o, ...n } = e, i = $e(Nt, t);
    return /* @__PURE__ */ m(
      Ve,
      {
        present: o || X(i.checked) || i.checked === !0,
        children: /* @__PURE__ */ m(
          W.span,
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
      disabled: c,
      name: l,
      value: d,
      form: p,
      bubbleInput: v,
      setBubbleInput: x
    } = $e(_t, e), y = H(t, x), w = xt(i), b = yt(o);
    u.useEffect(() => {
      const S = v;
      if (!S) return;
      const R = window.HTMLInputElement.prototype, T = Object.getOwnPropertyDescriptor(
        R,
        "checked"
      ).set, P = !n.current;
      if (w !== i && T) {
        const $ = new Event("click", { bubbles: P });
        S.indeterminate = X(i), T.call(S, X(i) ? !1 : i), S.dispatchEvent($);
      }
    }, [v, w, i, n]);
    const N = u.useRef(X(i) ? !1 : i);
    return /* @__PURE__ */ m(
      W.input,
      {
        type: "checkbox",
        "aria-hidden": !0,
        defaultChecked: a ?? N.current,
        required: s,
        disabled: c,
        name: l,
        value: d,
        form: p,
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
function X(e) {
  return e === "indeterminate";
}
function It(e) {
  return X(e) ? "indeterminate" : e ? "checked" : "unchecked";
}
var Ae = "rovingFocusGroup.onEntryFocus", po = { bubbles: !1, cancelable: !0 }, ue = "RovingFocusGroup", [Me, At, bo] = Zr(ue), [go, Et] = se(
  ue,
  [bo]
), [ho, vo] = go(ue), Tt = u.forwardRef(
  (e, r) => /* @__PURE__ */ m(Me.Provider, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ m(Me.Slot, { scope: e.__scopeRovingFocusGroup, children: /* @__PURE__ */ m(xo, { ...e, ref: r }) }) })
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
    onCurrentTabStopIdChange: c,
    onEntryFocus: l,
    preventScrollOnEntryFocus: d = !1,
    ...p
  } = e, v = u.useRef(null), x = H(r, v), y = vt(i), [w, b] = Oe({
    prop: a,
    defaultProp: s ?? null,
    onChange: c,
    caller: ue
  }), [N, S] = u.useState(!1), R = lo(l), I = At(t), T = u.useRef(!1), [P, $] = u.useState(0);
  return u.useEffect(() => {
    const f = v.current;
    if (f)
      return f.addEventListener(Ae, R), () => f.removeEventListener(Ae, R);
  }, [R]), /* @__PURE__ */ m(
    ho,
    {
      scope: t,
      orientation: o,
      dir: y,
      loop: n,
      currentTabStopId: w,
      onItemFocus: u.useCallback(
        (f) => b(f),
        [b]
      ),
      onItemShiftTab: u.useCallback(() => S(!0), []),
      onFocusableItemAdd: u.useCallback(
        () => $((f) => f + 1),
        []
      ),
      onFocusableItemRemove: u.useCallback(
        () => $((f) => f - 1),
        []
      ),
      children: /* @__PURE__ */ m(
        W.div,
        {
          tabIndex: N || P === 0 ? -1 : 0,
          "data-orientation": o,
          ...p,
          ref: x,
          style: { outline: "none", ...e.style },
          onMouseDown: B(e.onMouseDown, () => {
            T.current = !0;
          }),
          onFocus: B(e.onFocus, (f) => {
            const k = !T.current;
            if (f.target === f.currentTarget && k && !N) {
              const O = new CustomEvent(Ae, po);
              if (f.currentTarget.dispatchEvent(O), !O.defaultPrevented) {
                const D = I().filter((M) => M.focusable), j = D.find((M) => M.active), G = D.find((M) => M.id === w), U = [j, G, ...D].filter(
                  Boolean
                ).map((M) => M.ref.current);
                zt(U, d);
              }
            }
            T.current = !1;
          }),
          onBlur: B(e.onBlur, () => S(!1))
        }
      )
    }
  );
}), Pt = "RovingFocusGroupItem", Mt = u.forwardRef(
  (e, r) => {
    const {
      __scopeRovingFocusGroup: t,
      focusable: o = !0,
      active: n = !1,
      tabStopId: i,
      children: a,
      ...s
    } = e, c = ao(), l = i || c, d = vo(Pt, t), p = d.currentTabStopId === l, v = At(t), { onFocusableItemAdd: x, onFocusableItemRemove: y, currentTabStopId: w } = d;
    return u.useEffect(() => {
      if (o)
        return x(), () => y();
    }, [o, x, y]), /* @__PURE__ */ m(
      Me.ItemSlot,
      {
        scope: t,
        id: l,
        focusable: o,
        active: n,
        children: /* @__PURE__ */ m(
          W.span,
          {
            tabIndex: p ? 0 : -1,
            "data-orientation": d.orientation,
            ...s,
            ref: r,
            onMouseDown: B(e.onMouseDown, (b) => {
              o ? d.onItemFocus(l) : b.preventDefault();
            }),
            onFocus: B(e.onFocus, () => d.onItemFocus(l)),
            onKeyDown: B(e.onKeyDown, (b) => {
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
                setTimeout(() => zt(R));
              }
            }),
            children: typeof a == "function" ? a({ isCurrentTabStop: p, hasTabStop: w != null }) : a
          }
        )
      }
    );
  }
);
Mt.displayName = Pt;
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
function zt(e, r = !1) {
  const t = document.activeElement;
  for (const o of e)
    if (o === t || (o.focus({ preventScroll: r }), document.activeElement !== t)) return;
}
function Co(e, r) {
  return e.map((t, o) => e[(r + o) % e.length]);
}
var No = Tt, Ro = Mt, De = "Progress", Fe = 100, [_o] = se(De), [So, Io] = _o(De), Ot = u.forwardRef(
  (e, r) => {
    const {
      __scopeProgress: t,
      value: o = null,
      max: n,
      getValueLabel: i = Ao,
      ...a
    } = e;
    (n || n === 0) && !nt(n) && console.error(Eo(`${n}`, "Progress"));
    const s = nt(n) ? n : Fe;
    o !== null && !it(o, s) && console.error(To(`${o}`, "Progress"));
    const c = it(o, s) ? o : null, l = ye(c) ? i(c, s) : void 0;
    return /* @__PURE__ */ m(So, { scope: t, value: c, max: s, children: /* @__PURE__ */ m(
      W.div,
      {
        "aria-valuemax": s,
        "aria-valuemin": 0,
        "aria-valuenow": ye(c) ? c : void 0,
        "aria-valuetext": l,
        role: "progressbar",
        "data-state": Dt(c, s),
        "data-value": c ?? void 0,
        "data-max": s,
        ...a,
        ref: r
      }
    ) });
  }
);
Ot.displayName = De;
var Vt = "ProgressIndicator", $t = u.forwardRef(
  (e, r) => {
    const { __scopeProgress: t, ...o } = e, n = Io(Vt, t);
    return /* @__PURE__ */ m(
      W.div,
      {
        "data-state": Dt(n.value, n.max),
        "data-value": n.value ?? void 0,
        "data-max": n.max,
        ...o,
        ref: r
      }
    );
  }
);
$t.displayName = Vt;
function Ao(e, r) {
  return `${Math.round(e / r * 100)}%`;
}
function Dt(e, r) {
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
  return `Invalid prop \`max\` of value \`${e}\` supplied to \`${r}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${Fe}\`.`;
}
function To(e, r) {
  return `Invalid prop \`value\` of value \`${e}\` supplied to \`${r}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${Fe} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Po = Ot, Mo = $t, Le = "Radio", [zo, Ft] = se(Le), [Oo, Vo] = zo(Le), Lt = u.forwardRef(
  (e, r) => {
    const {
      __scopeRadio: t,
      name: o,
      checked: n = !1,
      required: i,
      disabled: a,
      value: s = "on",
      onCheck: c,
      form: l,
      ...d
    } = e, [p, v] = u.useState(null), x = H(r, (b) => v(b)), y = u.useRef(!1), w = p ? l || !!p.closest("form") : !0;
    return /* @__PURE__ */ A(Oo, { scope: t, checked: n, disabled: a, children: [
      /* @__PURE__ */ m(
        W.button,
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
          onClick: B(e.onClick, (b) => {
            n || c?.(), w && (y.current = b.isPropagationStopped(), y.current || b.stopPropagation());
          })
        }
      ),
      w && /* @__PURE__ */ m(
        Bt,
        {
          control: p,
          bubbles: !y.current,
          name: o,
          value: s,
          checked: n,
          required: i,
          disabled: a,
          form: l,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Lt.displayName = Le;
var Gt = "RadioIndicator", jt = u.forwardRef(
  (e, r) => {
    const { __scopeRadio: t, forceMount: o, ...n } = e, i = Vo(Gt, t);
    return /* @__PURE__ */ m(Ve, { present: o || i.checked, children: /* @__PURE__ */ m(
      W.span,
      {
        "data-state": Wt(i.checked),
        "data-disabled": i.disabled ? "" : void 0,
        ...n,
        ref: r
      }
    ) });
  }
);
jt.displayName = Gt;
var $o = "RadioBubbleInput", Bt = u.forwardRef(
  ({
    __scopeRadio: e,
    control: r,
    checked: t,
    bubbles: o = !0,
    ...n
  }, i) => {
    const a = u.useRef(null), s = H(a, i), c = xt(t), l = yt(r);
    return u.useEffect(() => {
      const d = a.current;
      if (!d) return;
      const p = window.HTMLInputElement.prototype, x = Object.getOwnPropertyDescriptor(
        p,
        "checked"
      ).set;
      if (c !== t && x) {
        const y = new Event("click", { bubbles: o });
        x.call(d, t), d.dispatchEvent(y);
      }
    }, [c, t, o]), /* @__PURE__ */ m(
      W.input,
      {
        type: "radio",
        "aria-hidden": !0,
        defaultChecked: t,
        ...n,
        tabIndex: -1,
        ref: s,
        style: {
          ...n.style,
          ...l,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
Bt.displayName = $o;
function Wt(e) {
  return e ? "checked" : "unchecked";
}
var Do = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"], Ne = "RadioGroup", [Fo] = se(Ne, [
  Et,
  Ft
]), Ut = Et(), qt = Ft(), [Lo, Go] = Fo(Ne), Ht = u.forwardRef(
  (e, r) => {
    const {
      __scopeRadioGroup: t,
      name: o,
      defaultValue: n,
      value: i,
      required: a = !1,
      disabled: s = !1,
      orientation: c,
      dir: l,
      loop: d = !0,
      onValueChange: p,
      ...v
    } = e, x = Ut(t), y = vt(l), [w, b] = Oe({
      prop: i,
      defaultProp: n ?? null,
      onChange: p,
      caller: Ne
    });
    return /* @__PURE__ */ m(
      Lo,
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
            orientation: c,
            dir: y,
            loop: d,
            children: /* @__PURE__ */ m(
              W.div,
              {
                role: "radiogroup",
                "aria-required": a,
                "aria-orientation": c,
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
Ht.displayName = Ne;
var Kt = "RadioGroupItem", Yt = u.forwardRef(
  (e, r) => {
    const { __scopeRadioGroup: t, disabled: o, ...n } = e, i = Go(Kt, t), a = i.disabled || o, s = Ut(t), c = qt(t), l = u.useRef(null), d = H(r, l), p = i.value === n.value, v = u.useRef(!1);
    return u.useEffect(() => {
      const x = (w) => {
        Do.includes(w.key) && (v.current = !0);
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
        active: p,
        children: /* @__PURE__ */ m(
          Lt,
          {
            disabled: a,
            required: i.required,
            checked: p,
            ...c,
            ...n,
            name: i.name,
            ref: d,
            onCheck: () => i.onValueChange(n.value),
            onKeyDown: B((x) => {
              x.key === "Enter" && x.preventDefault();
            }),
            onFocus: B(n.onFocus, () => {
              v.current && l.current?.click();
            })
          }
        )
      }
    );
  }
);
Yt.displayName = Kt;
var jo = "RadioGroupIndicator", Xt = u.forwardRef(
  (e, r) => {
    const { __scopeRadioGroup: t, ...o } = e, n = qt(t);
    return /* @__PURE__ */ m(jt, { ...n, ...o, ref: r });
  }
);
Xt.displayName = jo;
var Bo = Ht, Wo = Yt, Uo = Xt;
// @__NO_SIDE_EFFECTS__
function qo(e) {
  const r = /* @__PURE__ */ Ko(e), t = u.forwardRef((o, n) => {
    const { children: i, ...a } = o, s = u.Children.toArray(i), c = s.find(Xo);
    if (c) {
      const l = c.props.children, d = s.map((p) => p === c ? u.Children.count(l) > 1 ? u.Children.only(null) : u.isValidElement(l) ? l.props.children : null : p);
      return /* @__PURE__ */ m(r, { ...a, ref: n, children: u.isValidElement(l) ? u.cloneElement(l, void 0, d) : null });
    }
    return /* @__PURE__ */ m(r, { ...a, ref: n, children: i });
  });
  return t.displayName = `${e}.Slot`, t;
}
var Ho = /* @__PURE__ */ qo("Slot");
// @__NO_SIDE_EFFECTS__
function Ko(e) {
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
      const c = i(...s);
      return n(...s), c;
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
      const s = a.split(we), c = s[0] === "" && s.length > 1 ? 1 : 0;
      return Qt(s, c, r);
    },
    getConflictingClassGroupIds: (a, s) => {
      if (s) {
        const c = o[a], l = t[a];
        return c ? l ? Jo(l, c) : c : l || at;
      }
      return t[a] || at;
    }
  };
}, Qt = (e, r, t) => {
  if (e.length - r === 0)
    return t.classGroupId;
  const n = e[r], i = t.nextPart.get(n);
  if (i) {
    const l = Qt(e, r + 1, i);
    if (l) return l;
  }
  const a = t.validators;
  if (a === null)
    return;
  const s = r === 0 ? e.join(we) : e.slice(r).join(we), c = a.length;
  for (let l = 0; l < c; l++) {
    const d = a[l];
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
    Ge(n, t, o, r);
  }
  return t;
}, Ge = (e, r, t, o) => {
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
    Ge(e(o), r, t, o);
    return;
  }
  r.validators === null && (r.validators = []), r.validators.push(en(t, e));
}, dn = (e, r, t, o) => {
  const n = Object.entries(e), i = n.length;
  for (let a = 0; a < i; a++) {
    const [s, c] = n[a];
    Ge(c, Jt(r, s), t, o);
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
    let a = 0, s = 0, c = 0, l;
    const d = n.length;
    for (let w = 0; w < d; w++) {
      const b = n[w];
      if (a === 0 && s === 0) {
        if (b === st) {
          i.push(n.slice(c, w)), c = w + 1;
          continue;
        }
        if (b === "/") {
          l = w;
          continue;
        }
      }
      b === "[" ? a++ : b === "]" ? a-- : b === "(" ? s++ : b === ")" && s--;
    }
    const p = i.length === 0 ? n : n.slice(c);
    let v = p, x = !1;
    p.endsWith(ze) ? (v = p.slice(0, -1), x = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      p.startsWith(ze) && (v = p.slice(1), x = !0)
    );
    const y = l && l > c ? l - c : void 0;
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
      const a = t[i], s = a[0] === "[", c = r.has(a);
      s || c ? (n.length > 0 && (n.sort(), o.push(...n), n = []), o.push(a)) : n.push(a);
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
  let c = "";
  for (let l = s.length - 1; l >= 0; l -= 1) {
    const d = s[l], {
      isExternal: p,
      modifiers: v,
      hasImportantModifier: x,
      baseClassName: y,
      maybePostfixModifierPosition: w
    } = t(d);
    if (p) {
      c = d + (c.length > 0 ? " " + c : c);
      continue;
    }
    let b = !!w, N = o(b ? y.substring(0, w) : y);
    if (!N) {
      if (!b) {
        c = d + (c.length > 0 ? " " + c : c);
        continue;
      }
      if (N = o(y), !N) {
        c = d + (c.length > 0 ? " " + c : c);
        continue;
      }
      b = !1;
    }
    const S = v.length === 0 ? "" : v.length === 1 ? v[0] : i(v).join(":"), R = x ? S + ze : S, I = R + N;
    if (a.indexOf(I) > -1)
      continue;
    a.push(I);
    const T = n(N, b);
    for (let P = 0; P < T.length; ++P) {
      const $ = T[P];
      a.push(R + $);
    }
    c = d + (c.length > 0 ? " " + c : c);
  }
  return c;
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
  const a = (c) => {
    const l = r.reduce((d, p) => p(d), e());
    return t = gn(l), o = t.cache.get, n = t.cache.set, i = s, s(c);
  }, s = (c) => {
    const l = o(c);
    if (l)
      return l;
    const d = vn(c, t);
    return n(c, d), d;
  };
  return i = a, (...c) => i(xn(...c));
}, wn = [], z = (e) => {
  const r = (t) => t[e] || wn;
  return r.isThemeGetter = !0, r;
}, tr = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, rr = /^\((?:(\w[\w-]*):)?(.+)\)$/i, kn = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, Cn = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Nn = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, Rn = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, _n = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, Sn = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, K = (e) => kn.test(e), _ = (e) => !!e && !Number.isNaN(Number(e)), Y = (e) => !!e && Number.isInteger(Number(e)), Ee = (e) => e.endsWith("%") && _(e.slice(0, -1)), q = (e) => Cn.test(e), or = () => !0, In = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Nn.test(e) && !Rn.test(e)
), je = () => !1, An = (e) => _n.test(e), En = (e) => Sn.test(e), Tn = (e) => !g(e) && !h(e), Pn = (e) => Q(e, ar, je), g = (e) => tr.test(e), re = (e) => Q(e, sr, In), ct = (e) => Q(e, Ln, _), Mn = (e) => Q(e, cr, or), zn = (e) => Q(e, lr, je), dt = (e) => Q(e, nr, je), On = (e) => Q(e, ir, En), he = (e) => Q(e, dr, An), h = (e) => rr.test(e), le = (e) => ie(e, sr), Vn = (e) => ie(e, lr), ut = (e) => ie(e, nr), $n = (e) => ie(e, ar), Dn = (e) => ie(e, ir), ve = (e) => ie(e, dr, !0), Fn = (e) => ie(e, cr, !0), Q = (e, r, t) => {
  const o = tr.exec(e);
  return o ? o[1] ? r(o[1]) : t(o[2]) : !1;
}, ie = (e, r, t = !1) => {
  const o = rr.exec(e);
  return o ? o[1] ? r(o[1]) : t : !1;
}, nr = (e) => e === "position" || e === "percentage", ir = (e) => e === "image" || e === "url", ar = (e) => e === "length" || e === "size" || e === "bg-size", sr = (e) => e === "length", Ln = (e) => e === "number", lr = (e) => e === "family-name", cr = (e) => e === "number" || e === "weight", dr = (e) => e === "shadow", Gn = () => {
  const e = z("color"), r = z("font"), t = z("text"), o = z("font-weight"), n = z("tracking"), i = z("leading"), a = z("breakpoint"), s = z("container"), c = z("spacing"), l = z("radius"), d = z("shadow"), p = z("inset-shadow"), v = z("text-shadow"), x = z("drop-shadow"), y = z("blur"), w = z("perspective"), b = z("aspect"), N = z("ease"), S = z("animate"), R = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], I = () => [
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
  ], T = () => [...I(), h, g], P = () => ["auto", "hidden", "clip", "visible", "scroll"], $ = () => ["auto", "contain", "none"], f = () => [h, g, c], k = () => [K, "full", "auto", ...f()], O = () => [Y, "none", "subgrid", h, g], D = () => ["auto", {
    span: ["full", Y, h, g]
  }, Y, h, g], j = () => [Y, "auto", h, g], G = () => ["auto", "min", "max", "fr", h, g], J = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], U = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], M = () => ["auto", ...f()], ee = () => [K, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...f()], Re = () => [K, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...f()], _e = () => [K, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...f()], C = () => [e, h, g], qe = () => [...I(), ut, dt, {
    position: [h, g]
  }], He = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], Ke = () => ["auto", "cover", "contain", $n, Pn, {
    size: [h, g]
  }], Se = () => [Ee, le, re], F = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    l,
    h,
    g
  ], L = () => ["", _, le, re], me = () => ["solid", "dashed", "dotted", "double"], Ye = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], V = () => [_, Ee, ut, dt], Xe = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    y,
    h,
    g
  ], fe = () => ["none", _, h, g], pe = () => ["none", _, h, g], Ie = () => [_, h, g], be = () => [K, "full", ...f()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [q],
      breakpoint: [q],
      color: [or],
      container: [q],
      "drop-shadow": [q],
      ease: ["in", "out", "in-out"],
      font: [Tn],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [q],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [q],
      shadow: [q],
      spacing: ["px", _],
      text: [q],
      "text-shadow": [q],
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
        object: T()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: P()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": P()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": P()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: $()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": $()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": $()
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
        inset: k()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": k()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": k()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": k(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: k()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": k(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: k()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": k()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": k()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: k()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: k()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: k()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: k()
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
        z: [Y, "auto", h, g]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [K, "full", "auto", s, ...f()]
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
        order: [Y, "first", "last", "none", h, g]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": O()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: D()
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
        "grid-rows": O()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: D()
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
        "auto-cols": G()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": G()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: f()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": f()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": f()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...J(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...U(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...U()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...J()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...U(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...U(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": J()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...U(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...U()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: f()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: f()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: f()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: f()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: f()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: f()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: f()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: f()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: f()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: f()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: f()
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
        "space-x": f()
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
        "space-y": f()
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
        size: ee()
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
        w: [s, "screen", ...ee()]
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
          ...ee()
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
          ...ee()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...ee()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...ee()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...ee()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", t, le, re]
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
        font: [o, Fn, Mn]
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
        font: [Vn, zn, r]
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
          ...f()
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
        placeholder: C()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: C()
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
        decoration: [_, "from-font", "auto", h, re]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: C()
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
        indent: f()
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
        bg: qe()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: He()
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
          }, Y, h, g],
          radial: ["", h, g],
          conic: [Y, h, g]
        }, Dn, On]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: C()
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
        from: C()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: C()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: C()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: F()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": F()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": F()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": F()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": F()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": F()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": F()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": F()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": F()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": F()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": F()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": F()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": F()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": F()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": F()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: L()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": L()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": L()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": L()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": L()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": L()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": L()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": L()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": L()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": L()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": L()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": L()
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
        "divide-y": L()
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
        border: C()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": C()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": C()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": C()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": C()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": C()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": C()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": C()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": C()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": C()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": C()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: C()
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
        outline: ["", _, le, re]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: C()
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
        shadow: C()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", p, ve, he]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": C()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: L()
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
        ring: C()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [_, re]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": C()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": L()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": C()
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
        "text-shadow": C()
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
        "mix-blend": [...Ye(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": Ye()
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
        "mask-linear-from": V()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": V()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": C()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": C()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": V()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": V()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": C()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": C()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": V()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": V()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": C()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": C()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": V()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": V()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": C()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": C()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": V()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": V()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": C()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": C()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": V()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": V()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": C()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": C()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": V()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": V()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": C()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": C()
      }],
      "mask-image-radial": [{
        "mask-radial": [h, g]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": V()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": V()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": C()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": C()
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
        "mask-conic-from": V()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": V()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": C()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": C()
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
        mask: qe()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: He()
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
        blur: Xe()
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
        "drop-shadow": C()
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
        "backdrop-blur": Xe()
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
        "border-spacing": f()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": f()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": f()
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
        "perspective-origin": T()
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
        origin: T()
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
        accent: C()
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
        caret: C()
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
        "scroll-m": f()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": f()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": f()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": f()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": f()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": f()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": f()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": f()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": f()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": f()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": f()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": f()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": f()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": f()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": f()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": f()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": f()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": f()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": f()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": f()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": f()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": f()
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
        fill: ["none", ...C()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [_, le, re, ct]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...C()]
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
}, jn = /* @__PURE__ */ yn(Gn);
function E(...e) {
  return jn(ht(e));
}
const Bn = $r(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
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
  }
);
function ce({
  className: e,
  variant: r = "default",
  size: t = "default",
  asChild: o = !1,
  ...n
}) {
  return /* @__PURE__ */ m(
    o ? Ho : "button",
    {
      "data-slot": "button",
      "data-variant": r,
      "data-size": t,
      className: E(Bn({ variant: r, size: t, className: e })),
      ...n
    }
  );
}
function Wn({
  className: e,
  size: r = "default",
  ...t
}) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "card",
      "data-size": r,
      className: E(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        e
      ),
      ...t
    }
  );
}
function Un({ className: e, ...r }) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "card-header",
      className: E(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        e
      ),
      ...r
    }
  );
}
function qn({ className: e, ...r }) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "card-title",
      className: E(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        e
      ),
      ...r
    }
  );
}
function Hn({ className: e, ...r }) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "card-description",
      className: E("text-sm text-muted-foreground", e),
      ...r
    }
  );
}
function Kn({ className: e, ...r }) {
  return /* @__PURE__ */ m(
    "div",
    {
      "data-slot": "card-content",
      className: E("px-4 group-data-[size=sm]/card:px-3", e),
      ...r
    }
  );
}
function Yn({
  className: e,
  ...r
}) {
  return /* @__PURE__ */ m(
    Ct,
    {
      "data-slot": "checkbox",
      className: E(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        e
      ),
      ...r,
      children: /* @__PURE__ */ m(
        Rt,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
          children: /* @__PURE__ */ m(
            Er,
            {}
          )
        }
      )
    }
  );
}
function Be({ className: e, type: r, ...t }) {
  return /* @__PURE__ */ m(
    "input",
    {
      type: r,
      "data-slot": "input",
      className: E(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        e
      ),
      ...t
    }
  );
}
function Xn({
  className: e,
  value: r,
  ...t
}) {
  return /* @__PURE__ */ m(
    Po,
    {
      "data-slot": "progress",
      className: E(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        e
      ),
      ...t,
      children: /* @__PURE__ */ m(
        Mo,
        {
          "data-slot": "progress-indicator",
          className: "size-full flex-1 bg-primary transition-all",
          style: { transform: `translateX(-${100 - (r || 0)}%)` }
        }
      )
    }
  );
}
function Zn({
  className: e,
  ...r
}) {
  return /* @__PURE__ */ m(
    Bo,
    {
      "data-slot": "radio-group",
      className: E("grid w-full gap-2", e),
      ...r
    }
  );
}
function Qn({
  className: e,
  ...r
}) {
  return /* @__PURE__ */ m(
    Wo,
    {
      "data-slot": "radio-group-item",
      className: E(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        e
      ),
      ...r,
      children: /* @__PURE__ */ m(
        Uo,
        {
          "data-slot": "radio-group-indicator",
          className: "flex size-4 items-center justify-center",
          children: /* @__PURE__ */ m("span", { className: "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" })
        }
      )
    }
  );
}
const We = "__other__", xe = "__none__";
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
  const t = Array.from(r).reduce(
    (n, i, a) => n + i.charCodeAt(0) * (a + 1),
    0
  ), o = [...e];
  for (let n = o.length - 1; n > 0; n -= 1) {
    const i = (t + n * 17) % (n + 1);
    [o[n], o[i]] = [o[i], o[n]];
  }
  return o;
}
function mr(e) {
  const r = e.choices.map(ur), o = [..."choicesOrder" in e && e.choicesOrder === "random" ? Jn(r, `${e.name}:${e.title ?? ""}`) : r];
  return e.showNoneItem && o.push({ value: xe, text: "없음" }), e.showOtherItem && o.push({ value: We, text: "기타" }), o;
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
      return t.elements.flatMap(
        (n) => fr(e, r, n, t)
      );
    default:
      return [];
  }
}
function ii(e) {
  return e.pages.flatMap(
    (r) => r.elements.flatMap(
      (t) => fr(e, r, t)
    )
  );
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
  const t = e.match(
    /^\s*\{([^}]+)\}\s*(==|!=|>=|<=|>|<)\s*(.+?)\s*$/
  );
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
function ne(e, r) {
  return e.kind === "matrix-row" ? r[e.matrixName]?.[e.rowName] : r[e.name];
}
function Ue(e, r, t) {
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
  const t = ne(e, r);
  return e.kind === "checkbox" ? Array.isArray(t) && t.length > 0 : e.kind === "text" ? typeof t == "string" || typeof t == "number" : t != null && t !== "";
}
function fi(e, r) {
  if (!e.isRequired)
    return !0;
  const t = ne(e, r);
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
function br({
  cols: e = 1,
  children: r
}) {
  return /* @__PURE__ */ m(
    "div",
    {
      className: E(
        "mx-auto grid w-full gap-3",
        e === 1 ? "max-w-[80%]" : "max-w-[92%]",
        e >= 2 ? "md:grid-cols-2" : "grid-cols-1",
        e >= 3 ? "xl:grid-cols-3" : ""
      ),
      children: r
    }
  );
}
function pi(e, r, t) {
  const o = ne(e, r), n = e.kind === "radiogroup" ? `${e.name}__other` : void 0, i = e.kind === "radiogroup" ? e.colCount ?? 1 : 1, a = e.kind === "matrix-row" ? e.columns : e.choices;
  return /* @__PURE__ */ A("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ m(
      Zn,
      {
        value: o === void 0 ? "" : String(o),
        onValueChange: (s) => {
          const c = a.find(
            (l) => String(l.value) === s
          )?.value;
          t((l) => Ue(e, l, c));
        },
        className: "gap-3",
        children: /* @__PURE__ */ m(br, { cols: i, children: a.map((s) => {
          const c = pr(o, s.value);
          return /* @__PURE__ */ A(
            "label",
            {
              className: E(
                "option-card flex min-h-20 cursor-pointer items-start gap-4 rounded-3xl border px-4 py-4 transition-all",
                c ? "border-primary bg-primary/8 shadow-[0_22px_50px_-32px_rgba(19,72,70,0.65)]" : "border-border/80 bg-white/70 hover:border-primary/25 hover:bg-white"
              ),
              children: [
                /* @__PURE__ */ m(Qn, { value: String(s.value), className: "mt-1 size-5" }),
                /* @__PURE__ */ m("span", { className: "text-[clamp(0.98rem,0.88rem+0.28vw,1.08rem)] leading-[1.75]", children: s.text })
              ]
            },
            String(s.value)
          );
        }) })
      }
    ),
    e.kind === "radiogroup" && o === We && n !== void 0 ? /* @__PURE__ */ m(
      Be,
      {
        value: String(r[n] ?? ""),
        onChange: (s) => t((c) => ({
          ...c,
          [n]: s.target.value
        })),
        placeholder: "기타 내용을 입력해주세요",
        className: "h-12 rounded-2xl bg-white/80 px-4 text-sm"
      }
    ) : null
  ] });
}
function bi(e, r, t) {
  const o = Array.isArray(ne(e, r)) ? ne(e, r) : [], n = `${e.name}__other`;
  return /* @__PURE__ */ A("div", { className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ m(br, { cols: e.colCount ?? 1, children: e.choices.map((i) => {
      const a = o.includes(i.value);
      return /* @__PURE__ */ A(
        "label",
        {
          className: E(
            "option-card flex min-h-20 cursor-pointer items-start gap-4 rounded-3xl border px-4 py-4 transition-all",
            a ? "border-primary bg-primary/8 shadow-[0_22px_50px_-32px_rgba(19,72,70,0.65)]" : "border-border/80 bg-white/70 hover:border-primary/25 hover:bg-white"
          ),
          children: [
            /* @__PURE__ */ m(
              Yn,
              {
                checked: a,
                onCheckedChange: (s) => {
                  t((c) => {
                    const l = Array.isArray(c[e.name]) ? [...c[e.name]] : [];
                    let d = l;
                    return i.value === xe && s ? d = [xe] : s ? d = l.filter((p) => p !== xe).concat(i.value) : d = l.filter(
                      (p) => p !== i.value
                    ), {
                      ...c,
                      [e.name]: d
                    };
                  });
                },
                className: "mt-1 size-5"
              }
            ),
            /* @__PURE__ */ m("span", { className: "text-[clamp(1.04rem,0.9rem+0.5vw,1.24rem)] leading-[1.8] tracking-[-0.015em]", children: i.text })
          ]
        },
        String(i.value)
      );
    }) }),
    o.includes(We) ? /* @__PURE__ */ m(
      Be,
      {
        value: String(r[n] ?? ""),
        onChange: (i) => t((a) => ({
          ...a,
          [n]: i.target.value
        })),
        placeholder: "기타 내용을 입력해주세요",
        className: "h-12 rounded-2xl bg-white/80 px-4 text-sm"
      }
    ) : null
  ] });
}
function gi(e, r, t) {
  const o = ne(e, r);
  return /* @__PURE__ */ m("div", { className: "mx-auto w-full max-w-[80%] rounded-[30px] border border-slate-300/75 bg-white p-3 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)]", children: /* @__PURE__ */ m(
    Be,
    {
      type: e.inputType,
      min: e.min,
      max: e.max,
      value: o === void 0 ? "" : String(o),
      onChange: (n) => {
        const i = n.target.value, a = e.inputType === "number" ? i === "" ? "" : Number(i) : i;
        t((s) => Ue(e, s, a));
      },
      placeholder: "응답을 입력해주세요",
      className: "h-16 rounded-[22px] border-slate-300 bg-slate-50 px-5 !text-[clamp(1.1rem,0.96rem+0.46vw,1.35rem)] leading-[1.35] shadow-[inset_0_1px_2px_rgba(15,23,42,0.06)] placeholder:text-[clamp(1rem,0.92rem+0.22vw,1.12rem)] md:!text-[clamp(1.1rem,0.96rem+0.46vw,1.35rem)] focus-visible:border-primary focus-visible:bg-white"
    }
  ) });
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
function vi({
  step: e,
  groupSteps: r,
  groupStartIndex: t,
  answers: o,
  setAnswers: n,
  currentIndex: i,
  onFocusRow: a,
  onAdvance: s
}) {
  const c = e.columns.length <= 2, l = i - t, d = ae(null), p = ae(null), v = ae([]), x = ae(0), y = ae(null), w = ae(s), [b, N] = Pe(16), S = r[l] ?? e, R = l > 0, I = l < r.length - 1;
  oe(() => {
    w.current = s;
  }, [s]), oe(() => () => {
    y.current !== null && window.clearTimeout(y.current);
  }, []);
  const T = Qe((f) => {
    const k = Math.min(
      Math.max(l + f, 0),
      r.length - 1
    );
    k !== l && a(t + k);
  }, [l, t, r.length, a]), P = Qe((f) => {
    const k = Math.sign(f);
    return (k < 0 ? l > 0 : k > 0 ? l < r.length - 1 : !1) ? (x.current += f, Math.abs(x.current) < 30 || (T(x.current > 0 ? 1 : -1), x.current = 0), !0) : (x.current = 0, !1);
  }, [l, r.length, T]);
  oe(() => {
    const f = d.current;
    if (!f)
      return;
    const k = (O) => {
      P(O.deltaY) && O.preventDefault();
    };
    return f.addEventListener("wheel", k, { passive: !1 }), () => f.removeEventListener("wheel", k);
  }, [P]), oe(() => {
    const f = p.current, k = v.current[l];
    if (!f || !k)
      return;
    const O = () => {
      const j = Math.max(
        16,
        Math.round((f.clientHeight - k.offsetHeight) / 2)
      );
      N(
        (G) => G === j ? G : j
      );
    };
    O();
    const D = new ResizeObserver(O);
    return D.observe(f), D.observe(k), () => D.disconnect();
  }, [l]), oe(() => {
    const f = p.current, k = v.current[l];
    if (!f || !k)
      return;
    const D = k.offsetTop + k.offsetHeight / 2 - f.clientHeight / 2;
    f.scrollTo({
      top: Math.max(D, 0),
      behavior: "smooth"
    });
  }, [l, b]);
  function $(f) {
    y.current !== null && window.clearTimeout(y.current), y.current = window.setTimeout(() => {
      if (f < r.length - 1) {
        a(t + f + 1);
        return;
      }
      w.current();
    }, 180);
  }
  return /* @__PURE__ */ A("div", { className: "mx-auto flex w-full max-w-6xl flex-col gap-3", children: [
    /* @__PURE__ */ A("div", { className: "flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/65 bg-white/68 px-5 py-3 shadow-[0_30px_70px_-52px_rgba(19,37,36,0.65)]", children: [
      /* @__PURE__ */ A("div", { children: [
        /* @__PURE__ */ m("p", { className: "text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase", children: "Matrix View" }),
        /* @__PURE__ */ A("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          S.rowIndex + 1,
          " / ",
          r.length,
          " rows"
        ] })
      ] }),
      /* @__PURE__ */ A("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ m(
          ce,
          {
            type: "button",
            variant: "outline",
            size: "icon-lg",
            className: "rounded-full bg-white/75",
            onClick: () => T(-1),
            disabled: l === 0,
            "aria-label": "Previous row",
            children: /* @__PURE__ */ m(Ir, {})
          }
        ),
        /* @__PURE__ */ m(
          ce,
          {
            type: "button",
            variant: "outline",
            size: "icon-lg",
            className: "rounded-full bg-white/75",
            onClick: () => T(1),
            disabled: l === r.length - 1,
            "aria-label": "Next row",
            children: /* @__PURE__ */ m(kr, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ A(
      "div",
      {
        ref: d,
        className: "matrix-carousel relative overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(180deg,rgba(247,251,250,0.96),rgba(236,243,242,0.92))] p-4",
        children: [
          R ? /* @__PURE__ */ m("div", { className: "matrix-carousel__veil matrix-carousel__veil--top" }) : null,
          I ? /* @__PURE__ */ m("div", { className: "matrix-carousel__veil matrix-carousel__veil--bottom" }) : null,
          /* @__PURE__ */ m("div", { className: "overflow-x-auto", children: /* @__PURE__ */ m(
            "div",
            {
              className: "min-w-[680px] w-full md:min-w-0",
              style: {
                "--matrix-column-count": String(e.columns.length),
                "--matrix-choice-gap": c ? "1.5rem" : "0.75rem"
              },
              children: /* @__PURE__ */ m(
                "div",
                {
                  ref: p,
                  className: "matrix-carousel__viewport overflow-y-auto px-2",
                  children: /* @__PURE__ */ m(
                    "div",
                    {
                      className: "flex flex-col gap-3",
                      style: { paddingBlock: b },
                      children: r.map((f, k) => {
                        const O = k - l, D = O === 0 ? "active" : Math.abs(O) === 1 ? "near" : "far", j = ne(f, o);
                        return /* @__PURE__ */ A(
                          "div",
                          {
                            ref: (G) => {
                              v.current[k] = G;
                            },
                            "data-row-state": D,
                            className: E(
                              "matrix-carousel__row grid grid-cols-[minmax(0,40%)_minmax(0,60%)] items-center gap-3 rounded-[28px] border border-white/60 px-3 py-3 transition-[transform,opacity,filter,background-color,box-shadow] duration-300",
                              D === "active" ? "bg-white/92 shadow-[0_28px_75px_-52px_rgba(19,72,70,0.8)]" : "bg-white/55"
                            ),
                            onClick: () => a(t + k),
                            children: [
                              /* @__PURE__ */ m("div", { className: "flex min-h-24 items-center rounded-[22px] border border-transparent px-4 py-4 text-left", children: /* @__PURE__ */ A("div", { children: [
                                /* @__PURE__ */ A("div", { className: "text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase", children: [
                                  "Row ",
                                  k + 1
                                ] }),
                                /* @__PURE__ */ m("p", { className: "mt-2 break-keep text-[clamp(0.98rem,0.92rem+0.22vw,1.12rem)] leading-7 text-foreground", children: f.rowTitle })
                              ] }) }),
                              /* @__PURE__ */ m(
                                "div",
                                {
                                  className: E(
                                    "grid min-w-0 gap-3",
                                    c ? "justify-center" : ""
                                  ),
                                  style: {
                                    gap: "var(--matrix-choice-gap)",
                                    gridTemplateColumns: c ? `repeat(${f.columns.length}, minmax(9rem, 11rem))` : `repeat(${f.columns.length}, minmax(0, 1fr))`
                                  },
                                  children: f.columns.map((G) => {
                                    const J = pr(j, G.value);
                                    return /* @__PURE__ */ A(
                                      "button",
                                      {
                                        type: "button",
                                        className: E(
                                          "matrix-carousel__cell flex h-20 min-w-0 self-center items-center justify-center rounded-[22px] border px-2 py-3 text-center text-sm font-semibold transition-all",
                                          J ? "border-primary bg-primary text-primary-foreground shadow-[0_24px_45px_-30px_rgba(19,72,70,0.85)]" : "border-border/80 bg-white/86 text-foreground hover:border-primary/35 hover:bg-primary/6"
                                        ),
                                        onClick: (U) => {
                                          U.stopPropagation(), n((M) => Ue(f, M, G.value)), $(k);
                                        },
                                        "aria-pressed": J,
                                        children: [
                                          /* @__PURE__ */ m("span", { className: "sr-only", children: f.rowTitle }),
                                          /* @__PURE__ */ m("span", { className: "matrix-carousel__cell-shell", children: /* @__PURE__ */ m("span", { className: "matrix-carousel__cell-label", children: G.text }) })
                                        ]
                                      },
                                      String(G.value)
                                    );
                                  })
                                }
                              )
                            ]
                          },
                          f.id
                        );
                      })
                    }
                  )
                }
              )
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ m("p", { className: "matrix-carousel__instructions text-center text-sm text-muted-foreground", children: "마우스 휠 또는 위아래 버튼으로 행을 이동할 수 있고, 응답하면 자동으로 다음 행으로 내려갑니다." })
  ] });
}
function ki({
  questionnaire: e,
  formId: r,
  onComplete: t
}) {
  const o = Ze(() => ii(e), [e]), [n, i] = Pe(
    () => mt(o)
  ), [a, s] = Pe(0);
  oe(() => {
    i(mt(o)), s(0);
  }, [o, r]);
  const c = (k) => {
    i((O) => k(O));
  }, l = Ze(
    () => o.filter((k) => li(k.visibleIf, n)),
    [n, o]
  );
  oe(() => {
    l.length !== 0 && a >= l.length && s(l.length - 1);
  }, [a, l.length]);
  const d = l[a], p = l.length === 0 ? 0 : (a + 1) / l.length * 100;
  if (!d)
    return null;
  const v = d.kind === "matrix-row" ? d.rowTitle : d.title, x = ci(v), y = di(v), w = a > 0, b = fi(d, n), N = a === l.length - 1, S = l.filter((k) => mi(k, n)).length, R = d.kind === "matrix-row" ? hi(l, a) : null, I = R === null ? [] : l.slice(R.start, R.end + 1), T = R === null ? 0 : a - R.start, P = d.kind === "matrix-row" ? T + 1 : a + 1, $ = d.kind === "matrix-row" ? I.length : l.length;
  function f() {
    if (b) {
      if (N) {
        t?.({
          answers: n,
          completedSteps: S,
          totalSteps: l.length
        });
        return;
      }
      s((k) => Math.min(k + 1, l.length - 1));
    }
  }
  return /* @__PURE__ */ A(Wn, { className: "questionnaire-js glass-panel overflow-visible rounded-[32px] border-white/60 bg-white/68 py-0 shadow-[0_40px_120px_-58px_rgba(20,42,41,0.55)] backdrop-blur-xl", children: [
    /* @__PURE__ */ m(
      Un,
      {
        className: E(
          "border-b border-white/60 px-6 md:px-8",
          d.kind === "matrix-row" ? "gap-2 py-3 md:py-4" : "gap-4 py-5 md:py-6"
        ),
        children: /* @__PURE__ */ A(
          "div",
          {
            className: E(
              "flex flex-col",
              d.kind === "matrix-row" ? "gap-2" : "gap-4"
            ),
            children: [
              /* @__PURE__ */ A("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ A("div", { className: "flex flex-wrap items-center gap-3", children: [
                  /* @__PURE__ */ m("p", { className: "text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase", children: d.kind === "matrix-row" ? d.matrixTitle ?? d.panelTitle ?? d.formTitle ?? e.title ?? e.pages[0]?.title ?? "Questionnaire" : d.formTitle ?? e.title ?? e.pages[0]?.title ?? "Questionnaire" }),
                  /* @__PURE__ */ A("div", { className: "rounded-full border border-white/70 bg-white/75 px-3 py-2 text-sm text-muted-foreground shadow-sm", children: [
                    P,
                    " / ",
                    $
                  ] })
                ] }),
                /* @__PURE__ */ A(
                  ce,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "lg",
                    onClick: () => c((k) => ui(d, k)),
                    className: "h-11 rounded-full bg-white/75 px-4 hover:bg-white",
                    children: [
                      /* @__PURE__ */ m(zr, { "data-icon": "inline-start" }),
                      "Clear"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ m(Hn, { className: "max-w-5xl break-keep text-sm leading-7 text-muted-foreground md:text-base", children: (d.kind === "matrix-row" ? d.matrixDescription : void 0) ?? d.description ?? d.panelTitle ?? d.pageDescription ?? d.formDescription }),
              /* @__PURE__ */ m(Xn, { value: p, className: "h-2 rounded-full bg-black/8" }),
              /* @__PURE__ */ A("div", { className: "flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ A("div", { className: "inline-flex items-center gap-2", children: [
                  /* @__PURE__ */ m(Vr, { className: "size-4" }),
                  /* @__PURE__ */ A("span", { children: [
                    S,
                    " answered"
                  ] })
                ] }),
                /* @__PURE__ */ m("span", { children: d.kind === "matrix-row" ? d.pageTitle ?? d.formTitle : d.panelTitle ?? d.pageTitle ?? d.formTitle })
              ] })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ A(
      Kn,
      {
        className: E(
          "px-6 md:px-8",
          d.kind === "matrix-row" ? "py-4" : "py-7 md:py-8"
        ),
        children: [
          d.kind === "matrix-row" ? /* @__PURE__ */ m(
            vi,
            {
              step: d,
              groupSteps: I,
              groupStartIndex: R?.start ?? a,
              answers: n,
              setAnswers: c,
              currentIndex: a,
              onFocusRow: s,
              onAdvance: f
            }
          ) : /* @__PURE__ */ A(ft, { children: [
            /* @__PURE__ */ A(
              "div",
              {
                className: E(
                  "mx-auto mb-8 flex flex-col items-center text-center",
                  x.container
                ),
                children: [
                  /* @__PURE__ */ m(
                    qn,
                    {
                      className: E(
                        "break-keep font-semibold text-balance",
                        x.titleClass
                      ),
                      children: y.main
                    }
                  ),
                  y.aside ? /* @__PURE__ */ m(
                    "p",
                    {
                      className: E(
                        "max-w-4xl break-keep text-muted-foreground text-balance",
                        x.asideClass
                      ),
                      children: y.aside
                    }
                  ) : null
                ]
              }
            ),
            d.kind === "text" ? gi(d, n, c) : d.kind === "checkbox" ? bi(d, n, c) : pi(d, n, c)
          ] }),
          /* @__PURE__ */ A(
            "div",
            {
              className: E(
                "flex flex-col gap-3 border-t border-white/60 sm:flex-row sm:items-center sm:justify-between",
                d.kind === "matrix-row" ? "mt-4 pt-4" : "mt-8 pt-6"
              ),
              children: [
                /* @__PURE__ */ A(
                  ce,
                  {
                    type: "button",
                    variant: "outline",
                    size: "lg",
                    disabled: !w,
                    onClick: () => s((k) => Math.max(k - 1, 0)),
                    className: "h-12 rounded-full bg-white/72 px-5",
                    children: [
                      /* @__PURE__ */ m(Nr, { "data-icon": "inline-start" }),
                      "Previous"
                    ]
                  }
                ),
                /* @__PURE__ */ A("div", { className: "flex items-center gap-3", children: [
                  d.isRequired && !b ? /* @__PURE__ */ m("p", { className: "text-sm text-destructive", children: "필수 질문입니다. 응답 후 다음으로 진행할 수 있습니다." }) : null,
                  /* @__PURE__ */ A(
                    ce,
                    {
                      type: "button",
                      size: "lg",
                      disabled: !b,
                      onClick: f,
                      className: "h-12 rounded-full px-6 shadow-[0_24px_55px_-28px_rgba(19,72,70,0.75)]",
                      children: [
                        /* @__PURE__ */ m(Pr, { "data-icon": "inline-start" }),
                        N ? "Complete" : "Continue",
                        N ? null : /* @__PURE__ */ m(_r, { "data-icon": "inline-end" })
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  ki as QuestionnaireFlow
};
