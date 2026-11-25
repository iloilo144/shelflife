export default function UndoToast({ undo, onUndo }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {undo && (
        <div className="toast" key={undo.label}>
          <span>{undo.label}</span>
          <button onClick={onUndo}>Undo</button>
        </div>
      )}
    </div>
  )
}
