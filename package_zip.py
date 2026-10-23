import os
import zipfile

def make_zip(output_filename, source_dir):
    ignore_dirs = {
        'node_modules',
        '.git',
        'dist',
        '.aistudio',
        '__pycache__',
        '.cache',
        '.vite'
    }
    ignore_extensions = {
        '.zip',
        '.tar',
        '.gz',
        '.pyc'
    }

    print(f"Creating zip archive at {output_filename}...")
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Prune ignored directories in-place
            dirs[:] = [d for d in dirs if d not in ignore_dirs and not d.startswith('.git')]
            
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in ignore_extensions:
                    continue
                if file.startswith('.DS_Store'):
                    continue
                
                full_path = os.path.join(root, file)
                # Compute relative archive path
                rel_path = os.path.relpath(full_path, source_dir)
                # Prefix with project folder name for clean unzipping
                archive_name = os.path.join("smart-software-risk-ai", rel_path)
                zipf.write(full_path, archive_name)
                print(f"Added: {rel_path}")

    size_mb = os.path.getsize(output_filename) / (1024 * 1024)
    print(f"Successfully generated {output_filename} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    os.makedirs('/app/applet/public', exist_ok=True)
    target = '/app/applet/public/smart-software-risk-ai.zip'
    make_zip(target, '/app/applet')
