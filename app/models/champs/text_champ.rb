# == Schema Information
#
# Table name: champs
#
#  id               :integer          not null, primary key
#  data             :jsonb
#  private          :boolean          default(FALSE), not null
#  row              :integer
#  type             :string
#  value            :string
#  created_at       :datetime
#  updated_at       :datetime
#  dossier_id       :integer
#  etablissement_id :integer
#  external_id      :string
#  parent_id        :bigint
#  type_de_champ_id :integer
#
class Champs::TextChamp < Champ
end
