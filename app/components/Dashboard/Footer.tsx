export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Data Sources */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Data Sources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ministry of Education, Culture, Research and Technology</li>
              <li>• Central Bureau of Statistics (BPS)</li>
              <li>• PISA 2022 Assessment Results</li>
              <li>• Regional Government Budget Reports</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">About</h3>
            <p className="text-sm text-muted-foreground">
              The National Education Dashboard provides comprehensive insights into 
              Indonesia's education system, helping policymakers make data-driven decisions 
              for educational development.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Ministry of Education</li>
              <li>Jl. Jenderal Sudirman, Jakarta</li>
              <li>Email: info@kemdikbud.go.id</li>
              <li>Last Updated: July 2024</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Ministry of Education, Culture, Research and Technology - Republic of Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};