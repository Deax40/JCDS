// Composant pour afficher le fond thématique d'une catégorie
export default function CategoryBackground({ pattern = 'dots', gradient = 'from-purple to-pink' }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient de base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>

      {/* Pattern selon le type */}
      {pattern === 'code' && (
        <div className="absolute inset-0 opacity-20">
          <div className="font-mono text-white text-xs leading-relaxed p-8 overflow-hidden">
            <pre className="select-none">
{`function Formation() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    learnNewSkills();
  }, []);

  return (
    <div className="success">
      <h1>Compétences Acquises!</h1>
      {skills.map(skill => (
        <Achievement key={skill.id} />
      ))}
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      )}

      {pattern === 'dots' && (
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      )}

      {pattern === 'grid' && (
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <pattern id="grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {pattern === 'lines' && (
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <pattern id="lines" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="30" stroke="white" strokeWidth="2"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#lines)" />
          </svg>
        </div>
      )}

      {/* Overlay pour adoucir */}
      <div className="absolute inset-0 bg-black opacity-10"></div>
    </div>
  );
}
