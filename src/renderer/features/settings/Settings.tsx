import React, { useState, useEffect } from 'react';
import { User, Briefcase, Shield, FileText, Plus, Trash2, Save } from 'lucide-react';

export function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    profession: '',
    role: '',
    description: '',
    customFields: [] as { key: string; value: string }[]
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch profile data from backend API
    fetch('http://127.0.0.1:8000/v1/profiles')
      .then(res => res.json())
      .then(data => {
        if (data) setProfile(data);
      })
      .catch(err => console.log('Using default profile state'));
  }, []);

  const handleAddCustomField = () => {
    setProfile({
      ...profile,
      customFields: [...profile.customFields, { key: '', value: '' }]
    });
  };

  const handleCustomFieldChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...profile.customFields];
    updated[index][field] = val;
    setProfile({ ...profile, customFields: updated });
  };

  const handleRemoveCustomField = (index: number) => {
    const updated = profile.customFields.filter((_, i) => i !== index);
    setProfile({ ...profile, customFields: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('http://127.0.0.1:8000/v1/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage('Profile saved successfully!');
      } else {
        setMessage('Failed to save profile.');
      }
    } catch (err) {
      setMessage('Error connecting to backend API.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 text-gray-200">
      <div className="border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" /> User Profile Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Configure your professional identity and custom attributes for FireForm.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-indigo-900/50 border border-indigo-500 rounded text-sm text-indigo-200">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" /> Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g. Jane Doe"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-gray-400" /> Profession
            </label>
            <input
              type="text"
              value={profile.profession}
              onChange={e => setProfile({ ...profile, profession: e.target.value })}
              placeholder="e.g. Healthcare, Legal, Tech"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-gray-400" /> Role / Title
            </label>
            <input
              type="text"
              value={profile.role}
              onChange={e => setProfile({ ...profile, role: e.target.value })}
              placeholder="e.g. Attending Physician"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-gray-400" /> Bio / Description
          </label>
          <textarea
            rows={3}
            value={profile.description}
            onChange={e => setProfile({ ...profile, description: e.target.value })}
            placeholder="Brief professional summary..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-200">Custom Fields</h3>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-4 h-4" /> Add Field
            </button>
          </div>

          <div className="space-y-3">
            {profile.customFields.map((field, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Key (e.g. Department)"
                  value={field.key}
                  onChange={e => handleCustomFieldChange(index, 'key', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Cardiology)"
                  value={field.value}
                  onChange={e => handleCustomFieldChange(index, 'value', e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(index)}
                  className="p-2 text-red-400 hover:bg-red-950/30 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
export default Settings;
