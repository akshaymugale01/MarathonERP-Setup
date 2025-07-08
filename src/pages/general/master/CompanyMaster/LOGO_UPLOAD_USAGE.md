# Logo Upload Usage Documentation

## Backend Structure

The backend expects logo uploads using Rails nested attributes:

```ruby
logo_attributes: [:id, :active, :document]
```

This follows the Rails `has_one :logo` association pattern:
```ruby
has_one :logo, -> { where(relation: "Pms::CompanySetupLogo") }, 
         foreign_key: :relation_id, 
         class_name: 'Attachfile'
```

## Frontend Implementation

### 1. Type Definition

```typescript
export interface LogoAttributes {
  id?: number;
  active?: boolean;
  document?: File | null;
  _destroy?: boolean;
}

export interface Company {
  // ... other fields
  logo_attributes?: LogoAttributes;
}
```

### 2. Component Usage

```tsx
<CompanyLogoUpload 
  isReadOnly={false}
  setValue={setValue}
  existingLogo={{
    id: companyData.id,
    url: companyData.logo,
    filename: companyData.companylogo_file_name,
    active: true,
  }}
/>
```

### 3. Form Submission

The form automatically handles logo_attributes in the submission:

```javascript
// For new upload
{
  logo_attributes: {
    id: existingLogoId, // if editing
    active: true,
    document: File // the uploaded file
  }
}

// For removal
{
  logo_attributes: {
    id: existingLogoId,
    active: false,
    _destroy: true
  }
}
```

### 4. API Request

The service automatically detects file uploads and sends FormData:

```javascript
// Creates multipart/form-data request
const formData = new FormData();
formData.append('pms_company_setup[logo_attributes][document]', file);
formData.append('pms_company_setup[logo_attributes][id]', id);
formData.append('pms_company_setup[logo_attributes][active]', 'true');
```

## Features

- ✅ Drag and drop upload
- ✅ File validation (type, size)
- ✅ Image preview
- ✅ Remove logo functionality
- ✅ Existing logo display
- ✅ Rails nested attributes support
- ✅ FormData for file uploads
- ✅ Error handling
- ✅ Read-only mode support

## Usage Example

```tsx
// In edit mode with existing logo
const existingLogo = {
  id: company.id,
  url: company.logo,
  filename: company.companylogo_file_name,
  active: true,
};

// In create mode
const existingLogo = undefined;

<CompanyLogoUpload 
  isReadOnly={mode === 'view'}
  setValue={setValue}
  existingLogo={existingLogo}
/>
```

## Backend Expected Format

The backend receives:
```
pms_company_setup: {
  name: "Company Name",
  logo_attributes: {
    id: 123,           // for updates
    active: true,
    document: File,    // the uploaded file
    _destroy: false    // or true for removal
  }
}
```
