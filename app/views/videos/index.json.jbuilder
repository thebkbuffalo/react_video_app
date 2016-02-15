json.array!(@videos) do |video|
  json.extract! video, :id, :embed, :artist
  json.url video_url(video, format: :json)
end
