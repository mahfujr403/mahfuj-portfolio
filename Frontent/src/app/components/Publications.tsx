import PublicationCard from "../components/PublicationCard";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { usePublications } from "../hooks/usePublications";
import { Link } from "react-router";


export default function Publications() {

    const { data: featuredPublications } = usePublications(3, 0);


    return (
        <section id="publications" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">Featured Publications</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] mx-auto mb-6" />
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Research contributions in deep learning, NLP, and federated learning published in top-tier venues
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl mb-12">
            <div className="flex flex-col divide-y divide-white/10 rounded-2xl overflow-hidden glass border border-white/10">
              {featuredPublications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} compact />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/publications"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00f2fe] to-[#8b5cf6] text-black font-semibold rounded-xl hover:shadow-[0_0_40px_rgba(0,242,254,0.5)] transition-all duration-300"
            >
              View All Publications
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    )
}
