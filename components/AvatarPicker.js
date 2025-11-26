export default function AvatarPicker({ currentColor, currentShape, onColorChange, onShapeChange, initials }) {
  const colors = [
    { name: 'purple', class: 'from-purple to-pink', label: 'Violet' },
    { name: 'blue', class: 'from-blue to-cyan', label: 'Bleu' },
    { name: 'green', class: 'from-green to-emerald', label: 'Vert' },
    { name: 'red', class: 'from-red to-orange', label: 'Rouge' },
    { name: 'orange', class: 'from-orange to-yellow', label: 'Orange' },
    { name: 'pink', class: 'from-pink to-rose', label: 'Rose' },
    { name: 'yellow', class: 'from-yellow to-orange', label: 'Jaune' },
    { name: 'indigo', class: 'from-indigo to-purple', label: 'Indigo' },
    { name: 'teal', class: 'from-teal-500 to-emerald-500', label: 'Turquoise' },
  ];

  const shapes = [
    { name: 'circle', label: 'Rond', className: 'rounded-full' },
    { name: 'square', label: 'Carré', className: 'rounded-2xl' },
  ];

  const getShapeClass = (shape) => {
    const shapeObj = shapes.find(s => s.name === shape);
    return shapeObj ? shapeObj.className : 'rounded-full';
  };

  const getColorClass = (color) => {
    const colorObj = colors.find(c => c.name === color);
    return colorObj ? colorObj.class : 'from-purple to-pink';
  };

  return (
    <div className="space-y-6">
      {/* Prévisualisation */}
      <div className="text-center">
        <p className="text-sm font-semibold mb-3">Prévisualisation</p>
        <div
          className={`w-32 h-32 mx-auto bg-gradient-to-br ${getColorClass(currentColor)} flex items-center justify-center text-white text-4xl font-bold ${getShapeClass(currentShape)} transition-all duration-300`}
        >
          {initials || 'AB'}
        </div>
      </div>

      {/* Sélection de couleur */}
      <div>
        <p className="text-sm font-semibold mb-3">Couleur de l'avatar</p>
        <div className="grid grid-cols-3 gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => onColorChange(color.name)}
              className={`group relative p-4 rounded-xl border-2 transition-all ${
                currentColor === color.name
                  ? 'border-purple bg-purple bg-opacity-5'
                  : 'border-line hover:border-purple hover:border-opacity-30'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color.class}`}></div>
                <span className="text-xs font-medium">{color.label}</span>
              </div>
              {currentColor === color.name && (
                <div className="absolute top-2 right-2">
                  <i className="ph-fill ph-check-circle text-purple text-xl"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sélection de forme */}
      <div>
        <p className="text-sm font-semibold mb-3">Forme de l'avatar</p>
        <div className="grid grid-cols-3 gap-3">
          {shapes.map((shape) => (
            <button
              key={shape.name}
              type="button"
              onClick={() => onShapeChange(shape.name)}
              className={`group relative p-4 rounded-xl border-2 transition-all ${
                currentShape === shape.name
                  ? 'border-purple bg-purple bg-opacity-5'
                  : 'border-line hover:border-purple hover:border-opacity-30'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 bg-gradient-to-br ${getColorClass(currentColor)} ${shape.className}`}></div>
                <span className="text-xs font-medium">{shape.label}</span>
              </div>
              {currentShape === shape.name && (
                <div className="absolute top-2 right-2">
                  <i className="ph-fill ph-check-circle text-purple text-xl"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
