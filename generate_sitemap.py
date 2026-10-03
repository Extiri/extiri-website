import os
import xml.etree.ElementTree as ET
from xml.dom import minidom

def generate_sitemap():
    root_domain = "https://extiri.com"
    project_dir = os.path.dirname(os.path.abspath(__file__))
    sitemap_path = os.path.join(project_dir, "sitemap.xml")
    
    # Folders to completely ignore
    ignored_folders = {".git", ".venv", ".gemini", "blog", "node_modules"}
    
    urls = []
    
    for root, dirs, files in os.walk(project_dir):
        # Modify dirs in-place to prevent os.walk from scanning ignored folders
        dirs[:] = [d for d in dirs if d not in ignored_folders and not d.startswith(".")]
        
        for file in files:
            if file.lower().endswith(".html"):
                full_path = os.path.join(root, file)

                # Do not publish empty placeholders or error pages in the sitemap.
                if os.path.getsize(full_path) == 0 or file.lower() == "404.html":
                    continue

                rel_path = os.path.relpath(full_path, project_dir)

                # Use extensionless URLs to match the site's redirects. Preserve
                # directory URLs for index pages (for example /airstrip/).
                clean_rel = rel_path.replace(os.path.sep, "/")
                clean_rel = os.path.splitext(clean_rel)[0]
                if clean_rel == "index":
                    clean_rel = ""
                elif clean_rel.endswith("/index"):
                    clean_rel = clean_rel[:-len("index")]

                url = f"{root_domain}/{clean_rel}" if clean_rel else f"{root_domain}/"
                urls.append(url)

    # Sort urls alphabetically for cleaner layout
    urls = sorted(set(urls))
    
    # Build XML tree
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for url in urls:
        url_element = ET.SubElement(urlset, "url")
        loc = ET.SubElement(url_element, "loc")
        loc.text = url
        
    # Convert to pretty XML string
    xml_str = ET.tostring(urlset, encoding="utf-8")
    parsed_xml = minidom.parseString(xml_str)
    pretty_xml = parsed_xml.toprettyxml(indent="  ")
    
    # Save to file
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(pretty_xml)
        
    print(f"Successfully generated sitemap.xml with {len(urls)} entries.")

if __name__ == "__main__":
    generate_sitemap()
