"use client";

import React from "react";
import {
  ClarityValue,
  cvToHex,
  uintCV,
  intCV,
  trueCV,
  falseCV,
  standardPrincipalCV,
  stringAsciiCV,
  stringUtf8CV,
  bufferCV,
  noneCV,
  someCV,
} from "@stacks/transactions";

export type ArgType =
  | "uint"
  | "int"
  | "bool"
  | "principal"
  | "ascii"
  | "utf8"
  | "buffer-hex"
  | "optional-none"
  | "optional-some-uint"
  | "optional-some-int"
  | "optional-some-bool"
  | "optional-some-principal"
  | "optional-some-ascii"
  | "optional-some-utf8"
  | "optional-some-buffer-hex";

export type BuiltArgs = { cv: ClarityValue[]; hex: string[] };

export default function ClarityArgBuilder({ onChange, preset }: { onChange: (args: BuiltArgs) => void; preset?: Array<{ type: ArgType; value?: string }> }) {
  type Row = { id: string; type: ArgType; value: string; opt?: 'none' | 'some' | null };
  const [rows, setRows] = React.useState<Row[]>([]);

  // Apply preset rows when provided
  React.useEffect(() => {
    if (preset) {
      setRows(preset.map(p => ({ id: crypto.randomUUID(), type: p.type, value: p.value ?? "", opt: inferOptionalMode(p.type) })));
    }
  }, [preset, inferOptionalMode]);

  const addRow = () => {
    setRows((r) => [...r, { id: crypto.randomUUID(), type: "uint", value: "", opt: null }]);
  };

  const removeRow = (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const updateRow = (id: string, patch: Partial<Row>) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  function isOptionalType(t: ArgType): boolean {
    return t.startsWith('optional-');
  }
  function inferOptionalMode(t: ArgType): Row['opt'] {
    if (!isOptionalType(t)) return null;
    return t === 'optional-none' ? 'none' : 'some';
  }
  function baseFromOptional(t: ArgType): ArgType {
    if (!isOptionalType(t)) return t;
    if (t === 'optional-none') return 'uint'; // default base
    const m = t.replace('optional-some-', '') as ArgType;
    return (['uint','int','bool','principal','ascii','utf8','buffer-hex'] as ArgType[]).includes(m) ? m : 'uint';
  }
  function toOptional(base: ArgType, mode: Row['opt']): ArgType {
    if (!mode) return base;
    if (mode === 'none') return 'optional-none' as ArgType;
    return (`optional-some-${base}`) as ArgType;
  }

  const build = React.useCallback((): BuiltArgs => {
    const cvs: ClarityValue[] = [];
    for (const row of rows) {
      const { type, value, opt } = row;
      const effectiveType: ArgType = isOptionalType(type) ? type : toOptional(type, opt ?? null);
      switch (effectiveType) {
        case "uint": {
          const n = BigInt(value || "0");
          cvs.push(uintCV(n));
          break;
        }
        case "int": {
          const n = BigInt(value || "0");
          cvs.push(intCV(n));
          break;
        }
        case "bool": {
          const v = (value || "").toLowerCase();
          cvs.push(v === "true" ? trueCV() : falseCV());
          break;
        }
        case "principal": {
          cvs.push(standardPrincipalCV(value));
          break;
        }
        case "ascii": {
          cvs.push(stringAsciiCV(value));
          break;
        }
        case "utf8": {
          cvs.push(stringUtf8CV(value));
          break;
        }
        case "buffer-hex": {
          const hex = value.startsWith("0x") ? value.slice(2) : value;
          const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []);
          cvs.push(bufferCV(bytes));
          break;
        }
        case "optional-none": {
          cvs.push(noneCV());
          break;
        }
        case "optional-some-uint": {
          const n = BigInt(value || "0");
          cvs.push(someCV(uintCV(n)));
          break;
        }
        case "optional-some-int": {
          const n = BigInt(value || "0");
          cvs.push(someCV(intCV(n)));
          break;
        }
        case "optional-some-bool": {
          const v = (value || "").toLowerCase();
          cvs.push(someCV(v === "true" ? trueCV() : falseCV()));
          break;
        }
        case "optional-some-principal": {
          cvs.push(someCV(standardPrincipalCV(value)));
          break;
        }
        case "optional-some-ascii": {
          cvs.push(someCV(stringAsciiCV(value)));
          break;
        }
        case "optional-some-utf8": {
          cvs.push(someCV(stringUtf8CV(value)));
          break;
        }
        case "optional-some-buffer-hex": {
          const hex = value.startsWith("0x") ? value.slice(2) : value;
          const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) || []);
          cvs.push(someCV(bufferCV(bytes)));
          break;
        }
        default:
          break;
      }
    }
    const hex = cvs.map((cv) => cvToHex(cv));
    return { cv: cvs, hex };
  }, [rows, isOptionalType, toOptional, baseFromOptional]);

  React.useEffect(() => {
    onChange(build());
  }, [rows, build, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Function Arguments</h3>
        <button type="button" onClick={addRow} className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600">
          Add Arg
        </button>
      </div>
      {rows.length === 0 && <div className="text-xs text-gray-500">No args. Click Add Arg.</div>}
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-2 md:grid-cols-6 items-center">
            <label className="text-xs col-span-1">Type</label>
            <select
              aria-label="Arg type"
              className="border rounded px-2 py-1 col-span-2"
              value={row.type}
              onChange={(e) => updateRow(row.id, { type: e.target.value as ArgType })}
            >
              <option value="uint">uint</option>
              <option value="int">int</option>
              <option value="bool">bool</option>
              <option value="principal">principal</option>
              <option value="ascii">ascii</option>
              <option value="utf8">utf8</option>
              <option value="buffer-hex">buffer-hex</option>
              <option value="optional-none">optional-none</option>
              <option value="optional-some-uint">optional-some-uint</option>
              <option value="optional-some-int">optional-some-int</option>
              <option value="optional-some-bool">optional-some-bool</option>
              <option value="optional-some-principal">optional-some-principal</option>
              <option value="optional-some-ascii">optional-some-ascii</option>
              <option value="optional-some-utf8">optional-some-utf8</option>
              <option value="optional-some-buffer-hex">optional-some-buffer-hex</option>
            </select>
            <div className="col-span-3 flex items-center gap-2">
              <label className="text-xs">Optional</label>
              <input aria-label="Optional toggle" type="checkbox" checked={Boolean(row.opt) || isOptionalType(row.type)} onChange={(e) => {
                const enabled = e.target.checked;
                if (!enabled) {
                  // turn off optional wrapper
                  const base = baseFromOptional(row.type);
                  updateRow(row.id, { type: base, opt: null });
                } else {
                  // default to some()
                  const base = isOptionalType(row.type) ? baseFromOptional(row.type) : row.type;
                  updateRow(row.id, { type: base, opt: 'some' });
                }
              }} />
              {(Boolean(row.opt) || isOptionalType(row.type)) && (
                <select aria-label="Optional kind" className="border rounded px-2 py-1" value={row.opt ?? inferOptionalMode(row.type) ?? 'some'} onChange={(e) => {
                  const mode = e.target.value as Row['opt'];
                  const base = baseFromOptional(row.type);
                  updateRow(row.id, { type: toOptional(base, mode), opt: mode });
                }}>
                  <option value="some">some(...)</option>
                  <option value="none">none</option>
                </select>
              )}
            </div>
            <label className="text-xs col-span-1">Value</label>
            <input
              aria-label="Arg value"
              className="border rounded px-2 py-1 col-span-2"
              value={row.value}
              onChange={(e) => updateRow(row.id, { value: e.target.value })}
              placeholder={row.type === "bool" ? "true | false" : row.type === "principal" ? "ST..." : ""}
            />
            <div className="text-right">
              <button type="button" onClick={() => removeRow(row.id)} className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
