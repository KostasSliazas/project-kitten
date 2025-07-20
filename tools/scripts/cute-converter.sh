#!/bin/bash

# Supported image extensions
SUPPORTED_EXTENSIONS=("jpg" "jpeg" "png" "webp" "bmp" "tiff" "gif")

# Function to check if a file has a supported extension
is_supported_image() {
    local file=$1
    local extension="${file##*.}"
    for ext in "${SUPPORTED_EXTENSIONS[@]}"; do
        if [[ "${extension,,}" == "${ext,,}" ]]; then
            return 0
        fi
    done
    return 1
}

# Function to check and install required tools
check_and_install_tools() {
    # List of required tools
    local tools=("exiftool" "mogrify")
    local missing_tools=()

    # Check for missing tools
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done

    # If no tools are missing, return
    if [ ${#missing_tools[@]} -eq 0 ]; then
        echo "All required tools are installed."
        return
    fi

    # Display missing tools
    echo "The following tools are missing:"
    for tool in "${missing_tools[@]}"; do
        echo " - $tool"
    done

    # Ask user if they want to install missing tools
    read -p "Do you want to install them now? (y/n): " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
        # Detect package manager
        if command -v apt &> /dev/null; then
            sudo apt update
            for tool in "${missing_tools[@]}"; do
                sudo apt install -y "$tool"
            done
        elif command -v yum &> /dev/null; then
            sudo yum install -y epel-release # Required for exiftool in some cases
            for tool in "${missing_tools[@]}"; do
                sudo yum install -y "$tool"
            done
        elif command -v brew &> /dev/null; then
            for tool in "${missing_tools[@]}"; do
                brew install "$tool"
            done
        else
            echo "No supported package manager found. Please install the tools manually."
            exit 1
        fi
    else
        echo "Missing tools must be installed manually. Exiting."
        exit 1
    fi
}

# Function to create a backup of files
create_backup() {
    CURRENT_DIR=$(basename "$PWD")
    BACKUP_DIR="../${CURRENT_DIR}_backup"
    mkdir -p "$BACKUP_DIR"
    cp *.* "$BACKUP_DIR/"
    echo "Backup completed. All files copied to $BACKUP_DIR."
}
#!/bin/bash

# Function to list and convert image types
extension_change() {
  # Supported image extensions
  local extensions=("jpg" "jpeg" "png" "webp" "bmp" "tiff" "gif")
  local selected_extension
  local output_extension
  local images=()
  local converted_images=()

  echo "Select the type of images to convert:"
  for i in "${!extensions[@]}"; do
    echo "$((i + 1))) ${extensions[i]}"
  done
  read -p "Enter the number for the source image type: " source_number
  if [[ $source_number -gt 0 && $source_number -le ${#extensions[@]} ]]; then
    selected_extension="${extensions[source_number - 1]}"
  else
    echo "Invalid selection. Exiting."
    return 1
  fi

  read -p "Enter the number for the output image type: " target_number
  if [[ $target_number -gt 0 && $target_number -le ${#extensions[@]} ]]; then
    output_extension="${extensions[target_number - 1]}"
  else
    echo "Invalid selection. Exiting."
    return 1
  fi

  if [[ "$selected_extension" == "$output_extension" ]]; then
    echo "Source and target types are the same. No conversion needed."
    return 1
  fi

  # Find matching images
  images=($(find . -type f -iname "*.${selected_extension}"))
  if [[ ${#images[@]} -eq 0 ]]; then
    echo "No images of type '$selected_extension' found in the current directory."
    return 1
  fi

  echo "The following images will be converted:"
  for i in "${!images[@]}"; do
    echo "$((i + 1))) ${images[i]}"
  done

  read -p "Proceed with the conversion to '${output_extension}'? (y/n): " confirm
  if [[ "$confirm" != "y" ]]; then
    echo "Conversion cancelled."
    return 1
  fi

  # Convert images
  for image in "${images[@]}"; do
    output_file="${image%.*}.${output_extension}"
    convert "$image" "$output_file" && converted_images+=("$output_file")
  done

  if [[ ${#converted_images[@]} -gt 0 ]]; then
    echo "Conversion completed. The following images were converted:"
    for img in "${converted_images[@]}"; do
      echo "$img"
    done
  else
    echo "No images were converted."
  fi
}

# Function to generate an HTML image list
generate_image_list() {
# Ask for confirmation
read -p "Would you like to make images tiny and cute? (y/n): " user_input
# Check user input
if [[ "$user_input" == "y" ]]; then
    # Call resize Function
    resize_or_scale
fi

    local css_folder="../css"
    local css_file="$css_folder/styles.css"

    # Create the parent folder (one level up) if it doesn't exist
    mkdir -p "$(dirname "$css_folder")"

    # Create css folder if it doesn't exist
    mkdir -p "$css_folder"

    # Create the CSS file if it doesn't exist
    touch "$css_file"


    # Create the CSS file and add basic styles
    cat << 'EOF' > "$css_file"
body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin:0;
    background-color: #f0f0f0;
}

.images-container {
    margin: .25em;
  display: flex;
  flex-wrap: wrap;
  font-size: 0;
}

.images-container img {
  margin: .25em;
  overflow: hidden;
  background: #eee;
  flex: 1 1 182px;
  max-height: 108px;
  object-fit: cover;
  cursor: pointer;
  padding: 4px;
  border: 1px solid #aaa;
  font-size: 16px;
}

EOF

# Set the output file one level up
local output_file="../images.html"

# Ensure the parent directory exists
mkdir -p "$(dirname "$output_file")"

# Create or overwrite the output file
> "$output_file"

# Write the initial HTML structure to the output file
cat << 'EOF' > "$output_file"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="Gallery">
    <title>Gallery</title>
    <link rel="preload" href="css/styles.css" as="style" type="text/css" fetchpriority="high">
    <link rel="stylesheet" href="css/styles.css">
    <script defer src="js/k7.min.js"></script>
</head>
<body>
<div class="images-container">
EOF
local script_dir
script_dir=$(basename "$(pwd)")
# Loop through supported images and append them to the output file
for img in *.*; do
    if is_supported_image "$img"; then
        echo "    <img src=\"$script_dir/$img\" alt=\"$img\" loading=\"lazy\">" >>"$output_file"
    fi
done

# Close the HTML structure
cat << 'EOF' >> "$output_file"
</div>
</body>
</html>
EOF
echo "Image list generated: $output_file"
echo "Do not forget to place the JS folder"
echo "with the gallery script inside the" 
echo "directory where the images.html file exists."

# Define a string holder for JavaScript source
js_source="((r,h)=>{function q(a){return a.split(\"/\").slice(-1)[0]}function f(a,...c){for(let e=0;e<c.length;e+=1)a.appendChild(c[e])}function d(a,...c){a=h.createElement(a);for(let e=0;e<c.length;e+=2)a.setAttribute(c[e],c[e+1]);return a}const l=h.documentElement;class t{constructor(){this.h=[];this.isActive=this.l=!1;this.o=this.g=0}S(){var a=h.getElementsByClassName(\"images\");a=0<a.length?a:[h.body];const c=a.length,e=g=>this.Y(g);for(var b=0;b<c;b++){const g=a[b].getElementsByTagName(\"img\"),k=g.length;for(let m=
0;m<k;m++){const n=g[m];(n.getAttribute(\"src\")||\"\").trim()?this.h.push(n):console.warn(\"Invalid src:\",n)}}if(a[0]&&\"BODY\"===a[0].tagName)h.body.onclick=e;else for(b=0;b<c;b++)a[b].onclick=e;return this.h.length}J(){this.l||(this.l=!0,this.G.className=\"b a s o y l q\");this.l&&(clearTimeout(this.o),this.o=setTimeout(()=>{this.u().m();this.g===this.h.length-1&&this.H()},1330))}U(){d(\"a\",\"rel\",\"noopener\",\"download\",\"\",\"href\",this.i.src,\"target\",\"_blank\").click()}O(){this.g=0<this.g?this.g-1:this.h.length-1;return this}u(){this.g=this.g<this.h.length-1?this.g+1:0;return this}H(){this.l=!1;this.o&&(clearTimeout(this.o),this.o=null);this.A.className=\"\";this.B.className=\"\";this.G.className=\"b a s o y l\";this.L.className=\"b a s o j p\";this.N()}N(){this.F.className=0===this.g?\"n\":\"b y l\";this.C.className=this.g===this.h.length-1?\"n\":\"b y r\"}M(){this.isActive=!1;this.j.className=\"g h w y l\";l.className=l.classList.remove(\"f\")}m(){const a=this.h[this.g],c=a.src,e=q(c);var b=e.split(\".\");const g=b[0]+\".\"+(a.dataset.ext||\"jpg\");b=\"svg\"===b.slice(-1)[0].slice(0,3).toLowerCase()?c:c.replace(e,\"large/\"+g);this.isActive||(this.isActive=!0,l.classList.add(\"f\"),this.j.className=\"f w y l\");this.i&&this.i.src!==b&&(this.D.className=\"u\",this.s.removeChild(this.i),this.i=d(\"img\",\"src\",b,\"alt\",a.alt+\" selected\"),this.P(b),this.i.onload=()=>{this.D.className=\"n\";this.l&&this.J()},this.i.onerror=k=>{k.target.onerror=null;k.target.src=c;this.P(e)},this.v&&(this.v.textContent=this.g+1),f(this.s,this.i),this.N())}Y(a){var c=
a.target;\"IMG\"===c.tagName&&(c=this.h.indexOf(c),this.g=-1<c?c:0,this.m(),a.stopImmediatePropagation())}P(a){this.I.textContent=q(a)}Z(){const a={bl:()=>this.O().m(),bt:()=>this.u().m(),pu:()=>this.J(),dl:()=>this.U(),cl:()=>this.M()};a[\" \"]=a.pu;a.ArrowLeft=a.bl;a.ArrowRight=a.bt;var c=b=>{if(this.isActive){b.preventDefault();b.stopImmediatePropagation();const g=b.key||b.target.id;\"Escape\"!==g&&\"cl\"!==g||this.M();if(!a[g]||this.l||b.isComposing)this.H();else a[g]()}};this.j.addEventListener(\"click\",
c.bind(this));r.addEventListener(\"keyup\",c.bind(this));c={passive:!0};let e=0;this.j.addEventListener(\"touchstart\",b=>{e=b.touches[0].clientX},c);this.j.addEventListener(\"touchend\",b=>{b=b.changedTouches[0].clientX-e;50<Math.abs(b)&&(this.H(),0<b?this.O().m():this.u().m())},c)}W(){const a=d(\"link\",\"rel\",\"stylesheet\",\"href\",\"data:text/css;base64,QGtleWZyYW1lcyBrNy1ye3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKX19I2s3ICosI2s3IDo6YWZ0ZXIsI2s3IDo6YmVmb3Jle2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250OjEycHgvNCBzYW5zLXNlcmlmO3Bvc2l0aW9uOmFic29sdXRlfSNrNyAuYiAqe3otaW5kZXg6LTE7cG9pbnRlci1ldmVudHM6bm9uZX0jazd7YmFja2dyb3VuZDp2YXIoLS1jb2xvcjIsICMyMjMpO2NvbG9yOiNhYWE7cG9zaXRpb246Zml4ZWQ7dGV4dC1hbGlnbjpjZW50ZXI7dHJhbnNpdGlvbjp0cmFuc2Zvcm0gLjJzO3VzZXItc2VsZWN0Om5vbmU7ei1pbmRleDo5OTk5OTl9I2s3IGltZ3tiYWNrZ3JvdW5kOnZhcigtLWNvbG9yMSwgIzMzNCk7bWF4LWhlaWdodDoxMDAlO21heC13aWR0aDoxMDAlO3RyYW5zaXRpb246LjJzIG9wYWNpdHl9I2s3ICNmbCwjazcgI3Bse3RleHQtaW5kZW50OjUwcHg7d2hpdGUtc3BhY2U6bm93cmFwO2JvdHRvbToyNHB4O2hlaWdodDo0OHB4fSNrNyAjYWx7cmlnaHQ6NTBweH0jazcgI2FsLCNrNyAjaW4sI2s3ICNpbiBpbWcsI2s3ICNzdHtwb3NpdGlvbjpyZWxhdGl2ZX0jazcgI3N0e3RleHQtaW5kZW50OjB9I2s3ICNibCwjazcgI2J0e3dpZHRoOjE2MHB4O2JvcmRlcjowO2hlaWdodDoxMDAlO2JvcmRlci1yYWRpdXM6MH0jazcgI2xmOjphZnRlciwjazcgI3JnOjphZnRlcntwYWRkaW5nOjlweDt0b3A6MTRweH0jazcgI2xmOjphZnRlcntib3JkZXItd2lkdGg6MnB4IDAgMCAycHg7bGVmdDoxNHB4fSNrNyAjcmc6OmFmdGVye3JpZ2h0OjE0cHg7Ym9yZGVyLXdpZHRoOjJweCAycHggMCAwfSNrNyAjYmw6aG92ZXIgI2xmOjphZnRlcntsZWZ0OjlweH0jazcgI2J0OmhvdmVyICNyZzo6YWZ0ZXJ7cmlnaHQ6OXB4fSNrNyAjY2w6OmFmdGVyLCNrNyAjY2w6OmJlZm9yZXtib3JkZXItd2lkdGg6MCAwIDAgMnB4O2hlaWdodDozMHB4O2xlZnQ6MjNweDt0b3A6MTBweH0jazcgI3B1OjpiZWZvcmUsI2s3ICNzcHtib3JkZXItcmFkaXVzOjUwJTtoZWlnaHQ6MjRweDt3aWR0aDoyNHB4fSNrNyAjc3B7YW5pbWF0aW9uOms3LXIgLjNzIGxpbmVhciBpbmZpbml0ZTtib3JkZXItY29sb3I6dHJhbnNwYXJlbnQgI2FhYTtsZWZ0OjUwJTttYXJnaW46LTEycHggMCAwLTEycHg7dG9wOjUwJX0jazcgI2R3e2JvcmRlci1yYWRpdXM6MCAwIDRweCA0cHg7dG9wOjI3cHg7aGVpZ2h0OjZweDt3aWR0aDoyNHB4O2JvcmRlci10b3A6MH0jazcgI3B1OjpiZWZvcmV7dHJhbnNpdGlvbjouMnMgYm9yZGVyLXJhZGl1czt0b3A6MTJweH0jazcgI3B1LnE6OmJlZm9yZXtib3JkZXItcmFkaXVzOjRweH0jazcgI3B1OjphZnRlcntib3JkZXItY29sb3I6dHJhbnNwYXJlbnQgI2VlZTtib3JkZXItd2lkdGg6NHB4IDAgNHB4IDlweDtsZWZ0OjIwcHg7dG9wOjIwcHg7d2lkdGg6OHB4fSNrNyAjcHUucTo6YWZ0ZXJ7Ym9yZGVyLXdpZHRoOjAgMnB4O3BhZGRpbmctdG9wOjhweH0jazcgI2RsOjphZnRlcntib3JkZXItd2lkdGg6MCAwIDJweCAycHg7Ym90dG9tOjIxcHg7aGVpZ2h0OjEycHg7bGVmdDoxOHB4O3dpZHRoOjEycHh9I2s3ICNkbDo6YmVmb3Jle2JhY2tncm91bmQ6I2VlZTtoZWlnaHQ6MThweDtsZWZ0OjIzcHg7dG9wOjlweDt3aWR0aDoycHh9I2s3ICNjbHt0b3A6MjRweH0jazcgI2R3LCNrNyAjcHU6OmJlZm9yZXtsZWZ0OjEycHh9I2s3ICNjbCwjazcgI2ZsLCNrNyAjcmd7cmlnaHQ6MjRweH0jazcgI2xmLCNrNyAjcGx7bGVmdDoyNHB4fSNrNyAudCwjazcgaW1ne3RvcDo1MCU7ei1pbmRleDotMTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNTAlKX0jazcgLnA6OmFmdGVyLCNrNyAucDo6YmVmb3Jle3RyYW5zZm9ybTpyb3RhdGUoNDVkZWcpfSNrNyAuajo6YWZ0ZXJ7dHJhbnNmb3JtOnJvdGF0ZSgtNDVkZWcpfSNrNyAudywjazcud3toZWlnaHQ6MTAwJTt3aWR0aDoxMDAlfSNrNyAuYTo6YWZ0ZXIsI2s3IC5zOjpiZWZvcmUsI2s3IC51e2JvcmRlcjoycHggc29saWQgI2VlZX0jazcgLmJ7YmFja2dyb3VuZDowIDA7aGVpZ2h0OjQ4cHg7d2lkdGg6NDhweDtib3JkZXItcmFkaXVzOjdweDtib3JkZXI6MDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIC4xczttYXJnaW46MDtwYWRkaW5nOjA7Y29sb3I6aW5oZXJpdH0jazcgLmI6OmFmdGVyLCNrNyAuYjo6YmVmb3Jle2NvbnRlbnQ6IiJ9I2s3IC5iOmZvY3VzLCNrNyAuYjpob3ZlciwjazcgLmI6aG92ZXIgc3BhbntiYWNrZ3JvdW5kOiMwNzA3MDczMztvcGFjaXR5OjE7b3V0bGluZTowfSNrNyAjYmw6Zm9jdXMsI2s3ICNidDpmb2N1c3tiYWNrZ3JvdW5kOjAgMH0jazcgLmI6YWN0aXZle29wYWNpdHk6LjN9I2s3IC5ue2Rpc3BsYXk6bm9uZX0jazcgLmgsI2s3Lmh7b3BhY2l0eTowfSNrNyAub3tvcGFjaXR5Oi43fSNrNyAucntyaWdodDowfSNrNyAueSwjazcueXt0b3A6MH0jazcgLmwsI2s3Lmx7bGVmdDowfSNrNyAuZiwjazcuZixodG1sLmZ7b3ZlcmZsb3c6aGlkZGVuIWltcG9ydGFudH0jazcuZ3t0cmFuc2Zvcm06c2NhbGUoMCl9I3NwLnUrZGl2PmRpdiBpbWd7b3BhY2l0eTouMX1AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6MzIwcHgpeyNrNyAjZmw+c3BhbntkaXNwbGF5Om5vbmV9fUBtZWRpYSAobWluLXdpZHRoOjEwMjRweCl7I2s3Om5vdCg6aG92ZXIpICNjbnR+ZGl2LCNrNzpub3QoOmhvdmVyKSAjaW5+LmJ7b3BhY2l0eTowfX0=\");
f(h.getElementsByTagName(\"head\")[0],a);this.L=d(\"button\",\"id\",\"cl\",\"class\",\"a p o b j s\",\"aria-label\",\"Close\",\"title\",\"Close (Esc)\");this.V=d(\"span\",\"id\",\"lf\",\"class\",\"a j o b t\");this.X=d(\"span\",\"id\",\"rg\",\"class\",\"a p o b t\");this.j=d(\"div\",\"id\",\"k7\",\"class\",\"g h f w y l\",\"role\",\"dialog\",\"aria-label\",\"Image Gallery\");this.K=d(\"div\",\"id\",\"cnt\",\"class\",\"y l w\");this.F=d(\"button\",\"id\",\"bl\",\"class\",\"b y l\",\"aria-label\",\"Previous (Left Arrow)\");this.C=d(\"button\",\"id\",\"bt\",\"class\",\"b y r\",\"aria-label\",
\"Next (Right Arrow)\");this.s=d(\"div\",\"id\",\"in\",\"class\",\"w\");this.D=d(\"div\",\"id\",\"sp\",\"class\",\"n\",\"aria-hidden\",\"true\");this.i=d(\"img\",\"src\",\"data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACwAAAAAAQABAEACAkQBADs=\",\"alt\",\"\",\"loading\",\"lazy\");f(this.s,this.i);f(this.C,this.X);f(this.F,this.V);f(this.j,this.D,this.K);f(this.K,this.s,this.C,this.F,this.L);f(h.body,this.j);this.R=d(\"button\",\"id\",\"dl\",\"class\",\"y r a j o b\",\"aria-label\",\"download\");this.G=d(\"button\",\"id\",\"pu\",\"class\",\"y l a s o b\",\"aria-label\",
\"play\");this.A=d(\"div\",\"id\",\"pl\");this.B=d(\"div\",\"id\",\"fl\");this.I=d(\"span\",\"id\",\"al\",\"class\",\"f\");this.v=d(\"span\",\"id\",\"st\");this.T=d(\"span\",\"id\",\"dw\",\"class\",\"u\");f(this.B,this.I,this.R);f(this.j,this.B,this.A);f(this.A,this.G,h.createTextNode(\"Image \"),this.v,h.createTextNode(\" of \"+this.h.length));f(this.R,this.T)}}const p=new t;p.S()&&(p.W(),p.Z())})(window,document);"

# Ensure the js directory exists
if [ ! -d "js" ]; then
  echo "Error: js directory does not exist."
  exit 1
fi

# Read JavaScript files and store their contents in js_source
for file in js/*.js; do
  if [ -f "$file" ]; then
    js_source+="$(cat "$file")\n"
  fi
done

# Save the collected JavaScript source to the output file
echo "$js_source" > "$output_file"

echo "JavaScript source saved to $output_file"
}

# Function to remove metadata
remove_metadata() {
    for img in *.*; do
        if is_supported_image "$img"; then
            echo "Removing metadata: $img"
            exiftool -all= "$img" -overwrite_original
        fi
    done
    echo "Metadata removal complete."
}

# Function to display EXIF data
show_exif_data() {
    for img in *.*; do
        if is_supported_image "$img"; then
            echo "EXIF data for $img:"
            exiftool "$img"
            echo "====================================="
        fi
    done
}

# Function to resize images
resize_or_scale() {
    # Resize or Scale Images
    echo "Resize or Scale Images"

    # Ask for folder name to store larger (original) images
    read -p "Enter folder name to store larger images (originals) [default: large]: " LARGER_FOLDER
    LARGER_FOLDER=${LARGER_FOLDER:-large}  # Use 'photos' if no input is provided
    mkdir -p "$LARGER_FOLDER"  # Create folder if it doesn't exist


    # Ask for the extension name to convert original images to (larger images)
    echo "Select the extension to keep for larger images:"
    for i in "${!SUPPORTED_EXTENSIONS[@]}"; do
        echo "$((i+1))) ${SUPPORTED_EXTENSIONS[$i]}"
    done
    read -p "Enter choice (1-${#SUPPORTED_EXTENSIONS[@]}): " ext_choice
    LARGER_FORMAT=${SUPPORTED_EXTENSIONS[$((ext_choice-1))]}

    # Ask for resize/scaling option
    echo "Select resize option:"
    echo "1) Resize to specific dimensions"
    echo "2) Scale by percentage"
    read -p "Enter choice (1-2): " resize_choice

    # Ask for resized extension (smaller images)
    echo "Select extension for resized (smaller) images:"
    for i in "${!SUPPORTED_EXTENSIONS[@]}"; do
        echo "$((i+1))) ${SUPPORTED_EXTENSIONS[$i]}"
    done
    read -p "Enter choice (1-${#SUPPORTED_EXTENSIONS[@]}): " ext_choice
    SMALLER_FORMAT=${SUPPORTED_EXTENSIONS[$((ext_choice-1))]}

    case $resize_choice in
        1)
            # Resize to specific dimensions
            echo "Select resizing dimensions:"
            echo "1) 192x108"
            echo "2) 300x200"
            echo "3) 500x300"
            echo "4) 800x600"
            echo "5) 1024x768"
            echo "6) 1280x1024"
            echo "7) 1920x1080"

            read -p "Enter choice (1-7): " resize_choice

            case $resize_choice in
                1) RESIZE="192x108" ;;
                2) RESIZE="300x200" ;;
                3) RESIZE="500x300" ;;
                4) RESIZE="800x600" ;;
                5) RESIZE="1024x768" ;;
                6) RESIZE="1280x1024" ;;
                7) RESIZE="1920x1080" ;;
                *) echo "Invalid choice."; return ;;  # Exit if invalid input
            esac
            echo "Resizing images to $RESIZE..."

            # Process images
            for img in *.*; do
                if is_supported_image "$img" && [[ "$img" != l-* ]]; then
                    # Move the original image to the LARGER_FOLDER and convert it to LARGER_FORMAT
                    cp "$img" "$LARGER_FOLDER/$(basename "$img" | sed "s/\.[^.]*$//").$LARGER_FORMAT"
                    mogrify -format "$LARGER_FORMAT" "$LARGER_FOLDER/$(basename "$img" | sed "s/\.[^.]*$//").$LARGER_FORMAT"

                    # Resize and create the resized version with the smaller extension in the working directory
                    cp "$img" "$PWD/$(basename "$img")"  # Copy the original to the working directory
                    mogrify -resize "$RESIZE" -format "$SMALLER_FORMAT" "$PWD/$(basename "$img")"

                    # Ensure that no extra files are created
                    mv "$PWD/$(basename "$img" | sed "s/\.[^.]*$//").$SMALLER_FORMAT" "$PWD/$(basename "$img" | sed "s/\.[^.]*$//").$SMALLER_FORMAT"

                    # Remove the original file extension (if it was different)
                    rm "$PWD/$(basename "$img" | sed "s/\.[^.]*$//").${img##*.}"

                    echo "Processed: $img -> $LARGER_FOLDER/$(basename "$img" | sed "s/\.[^.]*$//").$LARGER_FORMAT (original), $(basename "$img" | sed "s/\.[^.]*$//").$SMALLER_FORMAT (resized)"
                fi
            done
            ;;
        2)
            read -p "Enter scale percentage (e.g., 50 for 50%): " scale
            for img in *.*; do
                if is_supported_image "$img"; then
                    mogrify -resize "$scale%" "$img"
                    echo "Resized: $img by $scale%"
                fi
            done
            ;;
        *)
            echo "Invalid choice for resize option."
            return ;;  # Exit if invalid input
    esac
}
# Function to add a prefix to files
add_prefix_to_images() {
    # Prompt user for prefix with a default value
    read -p "Enter prefix (default: 'l-'): " prefix
    prefix=${prefix:-"l-"}  # Use 'l-' if no input is provided

    echo "Selected prefix: '$prefix'"

    # Initialize a flag to track if any files will be changed
    local files_to_change=false

    # Preview the changes
    echo "The following files will be renamed:"
    for img in *.*; do
        if is_supported_image "$img" && [[ "$img" != "$prefix"* ]]; then
            echo "$img -> $prefix$img"
            files_to_change=true
        fi
    done

    # If no files need renaming, exit early
    if [[ "$files_to_change" == false ]]; then
        echo "No files require prefixing. Exiting."
        return
    fi

    # Ask for confirmation
    read -p "Proceed with renaming? (y/n): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        for img in *.*; do
            if is_supported_image "$img" && [[ "$img" != "$prefix"* ]]; then
                mv "$img" "$prefix$img"
                echo "Prefixed: $img -> $prefix$img"
            fi
        done
        echo "Renaming completed."
    else
        echo "Operation canceled."
    fi
}

# Menu system
convert_images() {
    while true; do
        clear
        cat << "EOF"
                /\_/\
               ( o.o )
=====================================
   CUTE Batch Image Converter Menu
=====================================
 1) Create backup
 2) Prefix file name
 3) Resize or scale images
 4) Generate image HTML list
 5) Remove image metadata
 6) Show EXIF data
 7) Convert
 8) Exit
=====================================
+++++++++++++++++++++++++++++++++++++
"Tools used for the script:
'exiftool','mogrify'
+++++++++++++++++++++++++++++++++++++
=====================================

EOF
        read -p "Choose an option (1-7): " choice
        case $choice in
        1) create_backup ;;
        2) add_prefix_to_images ;;
        3) resize_or_scale ;;
        4) generate_image_list ;;
        5) remove_metadata ;;
        6) show_exif_data ;;
        7) extension_change ;;
        8) echo "Goodbye and be cute"; exit 0 ;;
        *) echo "Invalid option. Please try again." ;;
        esac
        read -p "Press Enter to continue..."
    done
}

# Ensure tools are installed
check_and_install_tools

# Run the menu
convert_images
