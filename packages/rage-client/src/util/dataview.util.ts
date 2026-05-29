/**
 * DataView implementation for buffer manipulation
 * Credit: https://github.com/citizenfx/lua/blob/luaglm-dev/cfx/libs/scripts/examples/dataview.lua
 * Adapted for TypeScript
 */

export enum Endianness {
  Big = 'big',
  Little = 'little',
}

export class DataView {
  private buffer: ArrayBuffer;
  private view: globalThis.DataView;
  private _offset: number;
  private _length: number;
  private canGrow: boolean;

  constructor(length: number) {
    this.buffer = new ArrayBuffer(length);
    this.view = new globalThis.DataView(this.buffer);
    this._offset = 0;
    this._length = length;
    this.canGrow = true;
  }

  /**
   * Create a DataView from existing buffer
   */
  static wrap(buffer: ArrayBuffer): DataView {
    const dv = new DataView(buffer.byteLength);
    dv.buffer = buffer;
    dv.view = new globalThis.DataView(buffer);
    return dv;
  }

  /**
   * Get the underlying buffer
   */
  getBuffer(): ArrayBuffer {
    return this.buffer;
  }

  /**
   * Get byte length
   */
  byteLength(): number {
    return this._length;
  }

  /**
   * Get byte offset
   */
  byteOffset(): number {
    return this._offset;
  }

  /**
   * Create a subview of this DataView
   */
  subView(offset: number, length?: number): DataView {
    const subLength = length ?? (this._length - offset);
    const sub = new DataView(subLength);
    sub._offset = this._offset + offset;
    sub.canGrow = false;
    sub.buffer = this.buffer;
    sub.view = new globalThis.DataView(this.buffer, this._offset + offset, subLength);
    return sub;
  }

  // Int8 methods
  getInt8(offset = 0): number {
    return this.view.getInt8(this._offset + offset);
  }

  setInt8(offset: number, value: number): this {
    this.ensureSpace(offset, 1);
    this.view.setInt8(this._offset + offset, value);
    return this;
  }

  // Uint8 methods
  getUint8(offset = 0): number {
    return this.view.getUint8(this._offset + offset);
  }

  setUint8(offset: number, value: number): this {
    this.ensureSpace(offset, 1);
    this.view.setUint8(this._offset + offset, value);
    return this;
  }

  // Int16 methods
  getInt16(offset = 0, littleEndian = true): number {
    return this.view.getInt16(this._offset + offset, littleEndian);
  }

  setInt16(offset: number, value: number, littleEndian = true): this {
    this.ensureSpace(offset, 2);
    this.view.setInt16(this._offset + offset, value, littleEndian);
    return this;
  }

  // Uint16 methods
  getUint16(offset = 0, littleEndian = true): number {
    return this.view.getUint16(this._offset + offset, littleEndian);
  }

  setUint16(offset: number, value: number, littleEndian = true): this {
    this.ensureSpace(offset, 2);
    this.view.setUint16(this._offset + offset, value, littleEndian);
    return this;
  }

  // Int32 methods
  getInt32(offset = 0, littleEndian = true): number {
    return this.view.getInt32(this._offset + offset, littleEndian);
  }

  setInt32(offset: number, value: number, littleEndian = true): this {
    this.ensureSpace(offset, 4);
    this.view.setInt32(this._offset + offset, value, littleEndian);
    return this;
  }

  // Uint32 methods
  getUint32(offset = 0, littleEndian = true): number {
    return this.view.getUint32(this._offset + offset, littleEndian);
  }

  setUint32(offset: number, value: number, littleEndian = true): this {
    this.ensureSpace(offset, 4);
    this.view.setUint32(this._offset + offset, value, littleEndian);
    return this;
  }

  // Float32 methods
  getFloat32(offset = 0, littleEndian = true): number {
    return this.view.getFloat32(this._offset + offset, littleEndian);
  }

  setFloat32(offset: number, value: number, littleEndian = true): this {
    this.ensureSpace(offset, 4);
    this.view.setFloat32(this._offset + offset, value, littleEndian);
    return this;
  }

  // Float64 methods
  getFloat64(offset = 0, littleEndian = true): number {
    return this.view.getFloat64(this._offset + offset, littleEndian);
  }

  setFloat64(offset: number, value: number, littleEndian = true): this {
    this.ensureSpace(offset, 8);
    this.view.setFloat64(this._offset + offset, value, littleEndian);
    return this;
  }

  // BigInt64 methods
  getBigInt64(offset = 0, littleEndian = true): bigint {
    return this.view.getBigInt64(this._offset + offset, littleEndian);
  }

  setBigInt64(offset: number, value: bigint, littleEndian = true): this {
    this.ensureSpace(offset, 8);
    this.view.setBigInt64(this._offset + offset, value, littleEndian);
    return this;
  }

  // BigUint64 methods
  getBigUint64(offset = 0, littleEndian = true): bigint {
    return this.view.getBigUint64(this._offset + offset, littleEndian);
  }

  setBigUint64(offset: number, value: bigint, littleEndian = true): this {
    this.ensureSpace(offset, 8);
    this.view.setBigUint64(this._offset + offset, value, littleEndian);
    return this;
  }

  // String methods
  getString(offset: number, length: number): string {
    const bytes = new Uint8Array(this.buffer, this._offset + offset, length);
    return new TextDecoder().decode(bytes);
  }

  setString(offset: number, value: string): this {
    const encoded = new TextEncoder().encode(value);
    this.ensureSpace(offset, encoded.length);
    const target = new Uint8Array(this.buffer, this._offset + offset);
    target.set(encoded);
    return this;
  }

  // Fixed-length string methods
  getFixedString(offset: number, length: number): string {
    const bytes = new Uint8Array(this.buffer, this._offset + offset, length);
    // Find null terminator if present
    let actualLength = length;
    for (let i = 0; i < length; i++) {
      if (bytes[i] === 0) {
        actualLength = i;
        break;
      }
    }
    return new TextDecoder().decode(bytes.slice(0, actualLength));
  }

  setFixedString(offset: number, length: number, value: string): this {
    this.ensureSpace(offset, length);
    const encoded = new TextEncoder().encode(value);
    const target = new Uint8Array(this.buffer, this._offset + offset, length);
    target.fill(0); // Clear the space first
    target.set(encoded.slice(0, length)); // Copy up to length bytes
    return this;
  }

  /**
   * Ensure there's enough space in the buffer
   */
  private ensureSpace(offset: number, size: number): void {
    const required = this._offset + offset + size;

    if (required > this._length) {
      if (!this.canGrow) {
        throw new Error('Cannot grow subview');
      }

      // Grow buffer
      const newLength = Math.max(required, this._length * 2);
      const newBuffer = new ArrayBuffer(newLength);
      new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));

      this.buffer = newBuffer;
      this.view = new globalThis.DataView(newBuffer);
      this._length = newLength;
    }
  }

  /**
   * Get a typed array view
   */
  getTypedArray<T extends TypedArray>(
    type: TypedArrayConstructor<T>,
    offset = 0,
    length?: number
  ): T {
    const byteOffset = this._offset + offset;
    return new type(this.buffer, byteOffset, length);
  }

  /**
   * Copy data from another DataView or ArrayBuffer
   */
  copyFrom(source: DataView | ArrayBuffer, targetOffset = 0, sourceOffset = 0, length?: number): this {
    const sourceBuffer = source instanceof DataView ? source.getBuffer() : source;
    const actualLength = length ?? sourceBuffer.byteLength - sourceOffset;

    this.ensureSpace(targetOffset, actualLength);

    const target = new Uint8Array(this.buffer, this._offset + targetOffset, actualLength);
    const src = new Uint8Array(sourceBuffer, sourceOffset, actualLength);
    target.set(src);

    return this;
  }
}

// Type definitions for typed arrays
type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

type TypedArrayConstructor<T extends TypedArray> = new (
  buffer: ArrayBuffer,
  byteOffset?: number,
  length?: number
) => T;
