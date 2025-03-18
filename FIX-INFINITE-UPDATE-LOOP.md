# How to Fix the Infinite Update Loop Issues

You're encountering an infinite update loop in your React components. This is happening because you're calling `setState` inside a `useEffect` hook without proper dependency management. Here's how to fix these issues:

## 1. PropertyTaxContext.tsx

The issue is in the `updateMetrics` function. When this function is called inside a `useEffect` hook, it causes an infinite loop because the function itself is recreated on every render.

### Fix:

```tsx
// Before:
const updateMetrics = (field: string, value: number) => {
  setMetrics(prev => ({
    ...prev,
    [field]: value
  }));
};

// After:
const updateMetrics = useCallback((field: string, value: number) => {
  setMetrics(prev => ({
    ...prev,
    [field]: value
  }));
}, []); // Empty dependency array means this function won't change between renders
```

Also, make sure any `useEffect` hooks that call `updateMetrics` have proper dependency arrays:

```tsx
// Before:
useEffect(() => {
  updateMetrics('someField', someValue);
}, [someValue]); // Missing updateMetrics in the dependency array

// After:
useEffect(() => {
  updateMetrics('someField', someValue);
}, [someValue, updateMetrics]); // Include updateMetrics in the dependency array
```

## 2. LicenseContext.tsx

Similar issue with the `updateMetrics` function:

### Fix:

```tsx
// Before:
const updateMetrics = (field: keyof LicenseMetrics, value: any) => {
  setMetrics(prev => ({
    ...prev,
    [field]: value
  }));
};

// After:
const updateMetrics = useCallback((field: keyof LicenseMetrics, value: any) => {
  setMetrics(prev => ({
    ...prev,
    [field]: value
  }));
}, []); // Empty dependency array
```

## 3. PropertyTaxAnalysis.tsx and LicenseAnalysis.tsx

In these components, you're likely loading saved data and updating the state in a way that causes an infinite loop:

### Fix:

```tsx
// Before:
useEffect(() => {
  if (!isLoading && savedData) {
    updateMetrics('field1', savedData.field1);
    updateMetrics('field2', savedData.field2);
    // ...
  }
}, [isLoading, savedData, updateMetrics]); // updateMetrics changes on every render

// After:
useEffect(() => {
  if (!isLoading && savedData) {
    // Use a ref to track if this is the first load
    const isFirstLoad = useRef(true);
    
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      
      updateMetrics('field1', savedData.field1);
      updateMetrics('field2', savedData.field2);
      // ...
    }
  }
}, [isLoading, savedData, updateMetrics]); // Now updateMetrics is stable
```

## General Tips for Avoiding Infinite Loops

1. **Memoize Functions with useCallback**: Always wrap functions that are used in dependency arrays with `useCallback`.

2. **Use Refs for Values That Shouldn't Trigger Re-renders**: If you need to track a value but don't want changes to it to cause re-renders, use a ref.

3. **Carefully Manage Dependencies**: Make sure your dependency arrays include all values from the outer scope that your effect uses.

4. **Consider Using useReducer**: For complex state logic, `useReducer` can be more predictable than multiple `useState` calls.

5. **Add Conditional Checks**: Add conditions to prevent unnecessary state updates.

By applying these fixes, you should be able to resolve the infinite update loop issues in your application. 